//#include "client_https.hpp"
#include "server_https.hpp"
#include "server_wss.hpp"

// Added for the default_resource example
#include "crypto.hpp"
#include <algorithm>
#include <fstream>
#include <vector>

using namespace std;

typedef SimpleWeb::SocketServer<SimpleWeb::WSS> WssServer;
typedef SimpleWeb::Server<SimpleWeb::HTTPS> HttpsServer;

int main() {
  // HTTPS-server at port 8080 using 1 thread
  // Unless you do more heavy non-threaded processing in the resources,
  // 1 thread is usually faster than several threads
  HttpsServer httpsServer("server.crt", "server.key");
  httpsServer.config.port = 8080;
  // WSS server at port 443
  WssServer wssServer("server.crt", "server.key");
  wssServer.config.port = 8001;

  // Default GET-example. If no other matches, this anonymous function will be called.
  // Will respond with content in the web/-directory, and its subdirectories.
  // Default file: index.html
  // Can for instance be used to retrieve an HTML 5 client that uses REST-resources on this server
  httpsServer.default_resource["GET"] = [](shared_ptr<HttpsServer::Response> response, shared_ptr<HttpsServer::Request> request) {
    try {
		//ifstream html("device-share.html");
		string path = "device-share.html";
        SimpleWeb::CaseInsensitiveMultimap header;

//    Uncomment the following line to enable Cache-Control
//    header.emplace("Cache-Control", "max-age=86400");

#ifdef HAVE_OPENSSL
//    Uncomment the following lines to enable ETag
//    {
//      ifstream ifs(path.string(), ifstream::in | ios::binary);
//      if(ifs) {
//        auto hash = SimpleWeb::Crypto::to_hex_string(SimpleWeb::Crypto::md5(ifs));
//        header.emplace("ETag", "\"" + hash + "\"");
//        auto it = request->header.find("If-None-Match");
//        if(it != request->header.end()) {
//          if(!it->second.empty() && it->second.compare(1, hash.size(), hash) == 0) {
//            response->write(SimpleWeb::StatusCode::redirection_not_modified, header);
//            return;
//          }
//        }
//      }
//      else
//        throw invalid_argument("could not read file");
//    }
#endif

      auto ifs = make_shared<ifstream>();
      ifs->open(path, ifstream::in | ios::binary | ios::ate);

	  if (*ifs) {
		  auto length = ifs->tellg();
		  ifs->seekg(0, ios::beg);

		  header.emplace("Content-Length", to_string(length));
		  response->write(header);
	  }
	  else {
		  throw invalid_argument("could not read file");
	  }
        // Trick to define a recursive function within this scope (for example purposes)
      class FileServer {
        public:
          static void read_and_send(const shared_ptr<HttpsServer::Response> &response, const shared_ptr<ifstream> &ifs) {
            // Read and send 128 KB at a time
            static vector<char> buffer(131072); // Safe when server is running on one thread
            streamsize read_length;
            if((read_length = ifs->read(&buffer[0], static_cast<streamsize>(buffer.size())).gcount()) > 0) {
              response->write(&buffer[0], read_length);
              if(read_length == static_cast<streamsize>(buffer.size())) {
                response->send([response, ifs](const SimpleWeb::error_code &ec) {
                  if(!ec)
                    read_and_send(response, ifs);
                  else
                    cerr << "Connection interrupted" << endl;
                });
              }
            }
          }
        };
      FileServer::read_and_send(response, ifs);
      path = "jquery-3.2.1.min.js";
	  ifs->open(path, ifstream::in | ios::binary | ios::ate);
	  if (*ifs) {
		auto length = ifs->tellg();
		ifs->seekg(0, ios::beg);
      }
      else
        throw invalid_argument("could not read file");
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
	  //cout << "test" << endl;
	  httpsServer.start();
  });

  // Wait for server to start so that the client can connect
  this_thread::sleep_for(chrono::seconds(1));

  // Example 1: echo WebSocket Secure endpoint
  // Added debug messages for example use of the callbacks
  // Test with the following JavaScript:
  //   var wss=new WebSocket("wss://localhost:8080/echo");
  //   wss.onmessage=function(evt){console.log(evt.data);};
  //   wss.send("test");
  auto &echo = wssServer.endpoint["^/echo/?$"];

  echo.on_message = [](shared_ptr<WssServer::Connection> connection, shared_ptr<WssServer::Message> message) {
	  auto message_str = message->string();

	  cout << "Server: Message received: \"" << message_str << "\" from " << connection.get() << endl;

	  auto send_stream = make_shared<WssServer::SendStream>();
	  *send_stream << message_str;
	  // connection->send is an asynchronous function
	  connection->send(send_stream, [](const SimpleWeb::error_code &ec) {
		  if (ec) {
			  cout << "Server: Error sending message. " <<
				  // See http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/reference.html, Error Codes for error code meanings
				  "Error: " << ec << ", error message: " << ec.message() << endl;
		  }
	  });

	  // Alternatively, using a convenience function:
	  // connection->send(message_str, [](const SimpleWeb::error_code & /*ec*/) { /*handle error*/ });
  };

  echo.on_open = [](shared_ptr<WssServer::Connection> connection) {
	  cout << "Server: Opened connection " << connection.get() << endl;
  };

  // See RFC 6455 7.4.1. for status codes
  echo.on_close = [](shared_ptr<WssServer::Connection> connection, int status, const string & /*reason*/) {
	  cout << "Server: Closed connection " << connection.get() << " with status code " << status << endl;
  };

  // See http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/reference.html, Error Codes for error code meanings
  echo.on_error = [](shared_ptr<WssServer::Connection> connection, const SimpleWeb::error_code &ec) {
	  cout << "Server: Error in connection " << connection.get() << ". "
		  << "Error: " << ec << ", error message: " << ec.message() << endl;
  };

  thread wssServer_thread([&wssServer]() {
	  cout << " WSS server started!" << endl;
	  // Start WSS-server
	  wssServer.start();
  });

  // Wait for server to start so that the client can connect
  this_thread::sleep_for(chrono::seconds(1));

  httpsServer_thread.join();
  wssServer_thread.join();
}
