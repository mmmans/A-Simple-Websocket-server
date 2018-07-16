#include "server_ws.hpp"

using namespace std;

typedef SimpleWeb::SocketServer<SimpleWeb::WS> WsServer;


int main() {
	// WebSocket (WS)-server at port 8080 using 1 thread
	WsServer server;
	server.config.port = 8080;

	// Example 1: echo WebSocket endpoint
	// Added debug messages for example use of the callbacks
	// Test with the following JavaScript:
	//   var ws=new WebSocket("ws://localhost:8080/echo");
	//   ws.onmessage=function(evt){console.log(evt.data);};
	//   ws.send("test");
	auto &echo = server.endpoint["^/echo/?$"];

	echo.on_message = [](shared_ptr<WsServer::Connection> connection, shared_ptr<WsServer::Message> message) {
		auto message_str = message->string();

		cout << "Server: Message received: \"" << message_str << "\" from " << connection.get() << endl;

		//cout << "Server: Sending message \"" << message_str << "\" to " << connection.get() << endl;

		auto send_stream = make_shared<WsServer::SendStream>();
		*send_stream << message_str;
		// connection->send is an asynchronous function
		/*connection->send(send_stream, [](const SimpleWeb::error_code &ec) {
			if (ec) {
				cout << "Server: Error sending message. " <<
					// See http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/reference.html, Error Codes for error code meanings
					"Error: " << ec << ", error message: " << ec.message() << endl;
			}
		});
		*/
		// Alternatively, using a convenience function:
		// connection->send(message_str, [](const SimpleWeb::error_code & /*ec*/) { /*handle error*/ });
	};

	echo.on_open = [](shared_ptr<WsServer::Connection> connection) {
		cout << "Server: Opened connection " << connection.get() << endl;
	};

	// See RFC 6455 7.4.1. for status codes
	echo.on_close = [](shared_ptr<WsServer::Connection> connection, int status, const string & /*reason*/) {
		cout << "Server: Closed connection " << connection.get() << " with status code " << status << endl;
	};

	// See http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/reference.html, Error Codes for error code meanings
	echo.on_error = [](shared_ptr<WsServer::Connection> connection, const SimpleWeb::error_code &ec) {
		cout << "Server: Error in connection " << connection.get() << ". "
			<< "Error: " << ec << ", error message: " << ec.message() << endl;
	};


	thread server_thread([&server]() {
		// Start WS-server
		cout << "ws server started!!" << endl;
		server.start();
	});

	// Wait for server to start so that the client can connect
	this_thread::sleep_for(chrono::seconds(1));


	server_thread.join();

	return 0;
}
