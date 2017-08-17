// Main.cpp : Defines the entry point for the console application.
//

#include <proxy_server.h>
#include <exception>
int main()
{
	//std::cout << g_videoBuffer.videoFrames[0].data<< std::endl;
	std::thread RTAV(data_swither_start);
	proxy_server_start();
	//RTAV.join();
	return 0;
	//testhread.join();
	
    
}

