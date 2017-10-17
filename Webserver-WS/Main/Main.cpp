// Main.cpp : Defines the entry point for the console application.
//
#include "proxy_server.h"
#include <exception>
using namespace std;
int main()
{
	//std::thread RTAV(data_swither_start);
	proxy_server_start();
	//RTAV.join();

	return 0;   
}


