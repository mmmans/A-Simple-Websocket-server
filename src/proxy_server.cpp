#include "proxy_server.h"
#include "utility.hpp"
// Added for the default_resource example
#include "crypto.hpp"
#include <algorithm>
#include <fstream>
#include <vector>
#include <iostream>
using namespace std;
WssServer::Endpoint *echo;
// define this class to send files to client more convenient
class FileServer {
public:
	static void read_and_send(const shared_ptr<HttpsServer::Response> &response, const shared_ptr<ifstream> &ifs) {
		// Read and send 128 KB at a time
		static vector<char> buffer(131072); // Safe when server is running on one thread
		streamsize read_length;
		if ((read_length = ifs->read(&buffer[0], static_cast<streamsize>(buffer.size())).gcount()) > 0) {
			response->write(&buffer[0], read_length);
			if (read_length == static_cast<streamsize>(buffer.size())) {
				response->send([response, ifs](const SimpleWeb::error_code &ec) {
					if (!ec)
						read_and_send(response, ifs);
					else
						cerr << "Connection interrupted" << endl;
				});
			}
		}
	}
};

int proxy_server_start() {
  // HTTPS-server at port 8080 using 1 thread
  HttpsServer httpsServer("server.crt", "server.key");
  httpsServer.config.port = 8080;
  // WSS server at port 8001 using 1 thread
  WssServer wssServer("server.crt", "server.key");
  wssServer.config.port = 8057;

  // deal with the http get method
  httpsServer.default_resource["GET"] = [](shared_ptr<HttpsServer::Response> response, shared_ptr<HttpsServer::Request> request) {
    try {
		  string path = request->path;
		  if (path == "/")
			  path = path+ "main.html";
		  path = "web" + path;
		  cout << path << endl;
          SimpleWeb::CaseInsensitiveMultimap header;

		  auto ifs = make_shared<ifstream>();
		  ifs->open(path, ifstream::in | ios::binary | ios::ate);
		  cout << "test" << endl;
		  if (*ifs) {
			  auto length = ifs->tellg();
			  ifs->seekg(0, ios::beg);

			  header.emplace("Content-Length", to_string(length));
			 // header.emplace("content-Type", "image/gif");
			  response->write(header);
		  }
		  else {
			  throw invalid_argument("could not read file");
		  }

          FileServer::read_and_send(response, ifs);   
    }
    catch(const exception &e) {
          response->write(SimpleWeb::StatusCode::client_error_bad_request, "Could not open path " + request->path + ": " + e.what());
    }
  };

  httpsServer.on_error = [](shared_ptr<HttpsServer::Request> /*request*/, const SimpleWeb::error_code & /*ec*/) {
    // Handle errors here
  };

  thread httpsServer_thread([&httpsServer]() {
    // Start server
	  cout << " HTTPS server started!" << endl;
	  httpsServer.start();
  });

  // Test with the following JavaScript:
  //   var wss=new WebSocket("wss://localhost:8080/echo");

  echo = &wssServer.endpoint[".*"];

  echo->on_message = [](shared_ptr<WssServer::Connection> connection, shared_ptr<WssServer::Message> message) {

	  string message_str = message->string();
	  cout << "Server: Message received: " << message_str.length();
	  //determine the next packet's data from camera or microphone
	  if (message_str[0] == 1) {

			  cout << "from audio" << endl;
			  AudioFrame* aframe = &(g_audioBuffer.audioFrames[g_audioBuffer.nextWriteIndex]);
			  message_str = message_str.substr(2);
			  memcpy(aframe->data, message_str.c_str(), message_str.length());
			  aframe->dwsize = message_str.length();
			  g_audioBuffer.nextWriteIndex = GetNextIndex(g_audioBuffer.nextWriteIndex, 10);

			  return;
	  }
	  else if(message_str[0] == 0){

			  cout << "from video" << endl;
			  VideoFrame* bframe = &(g_videoBuffer.videoFrames[g_videoBuffer.nextWriteIndex]);
			  message_str = message_str.substr(2);
			  memcpy(bframe->data, message_str.c_str(),message_str.length());
			  bframe->dwsize = message_str.length();
			  g_videoBuffer.nextWriteIndex = GetNextIndex(g_videoBuffer.nextWriteIndex, 3);	

			  return;
	  }
	  else if(message_str[0] == 112){// broswer request a full frame
		  auto send_stream = make_shared<WssServer::SendStream>();
		  send_stream->write((char*)frame, HEAD_SIZE + finfo.w*finfo.h * 3);
		  connection->send(send_stream);
	  }
	  else if (message_str[0] == 3 || message_str[0] == 2 || message_str[0] == 2) {//mouse event
		  sendtoMKS(message_str);
	  }
  };

  echo->on_open = [&wssServer](shared_ptr<WssServer::Connection> connection) {
	  cout << "Server: Opened connection " << connection.get() << endl;
	  //auto &echo = wssServer.endpoint[".*"];
	  //auto send_stream = make_shared<WssServer::SendStream>();
	  //send_stream->write((char*)frame, HEAD_SIZE + finfo.w*finfo.h * 3);
	 // for( auto &c : echo.get_connections())
	  //connection->send(send_stream);

  };

  // See RFC 6455 7.4.1. for status codes
  echo->on_close = [](shared_ptr<WssServer::Connection> connection, int status, const string & /*reason*/) {
	  cout << "Server: Closed connection " << connection.get() << " with status code " << status << endl;
  };

  // See http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/reference.html, Error Codes for error code meanings
  echo->on_error = [](shared_ptr<WssServer::Connection> connection, const SimpleWeb::error_code &ec) {
	  cout << "Server: Error in connection " << connection.get() << ". "
		  << "Error: " << ec << ", error message: " << ec.message() << endl;
  };

  thread wssServer_thread([&wssServer]() {
	  cout << " WSS server started!" << endl;
	  // Start WSS-server
	  wssServer.start();
  });
  thread viewcli_thread(SHAREConnectioScreenThread);
  httpsServer_thread.join();
  wssServer_thread.join();
  viewcli_thread.join();
  return 0;
}
