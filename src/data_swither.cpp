// DataSwitcher.cpp : Defines the entry point for the console application.
//
#include "proxy_server.h"
//using namespace std;
AudioBuffer g_audioBuffer;
VideoBuffer g_videoBuffer;
unsigned char *frame;
frameInfo finfo;
SOCKET sockEventConn;

extern const unsigned long DEFAULT_VIDEO_FRAME_SIZE = 320*240*4;
extern const unsigned long DEFAULT_AUDIO_FRAEM_SIZE = 500; // 8K HZ, double channel
// Get Next index
int GetNextIndex(int CurrentIndex, int moder)
{
	return (CurrentIndex + 1) % moder;
}

void InitBuffers()
{
	printf("Initialize global buffers...\r");
	memset(&g_audioBuffer, 0, sizeof(g_audioBuffer));
	memset(&g_videoBuffer, 0, sizeof(g_videoBuffer));

	for (int i = 0; i < 10; i++) {
		AudioFrame* frame = &(g_audioBuffer.audioFrames[i]);
		frame->data = (char*)malloc(DEFAULT_AUDIO_FRAEM_SIZE);
		frame->dwsize = 0;
		frame->dwMaxSize = DEFAULT_AUDIO_FRAEM_SIZE;
	}

	for (int j = 0; j < 3; j++) {
		VideoFrame* vFrame = &(g_videoBuffer.videoFrames[j]);
		vFrame->data = (char*)malloc(DEFAULT_VIDEO_FRAME_SIZE);
		vFrame->dwMaxSize = DEFAULT_VIDEO_FRAME_SIZE;
		vFrame->dwsize = 0;
	}
}



SOCKET CreateAndBind(int port)
{
	SOCKET sockSrv = socket(AF_INET, SOCK_STREAM, 0);
	if (sockSrv == INVALID_SOCKET) {
		printf("%s(): Failed to create socket, error(%x)\n", __FUNCTION__, GetLastError());
		return INVALID_SOCKET;
	}
	SOCKADDR_IN addrSrv;

	addrSrv.sin_addr.S_un.S_addr = htonl(INADDR_ANY);
	addrSrv.sin_family = AF_INET;
	addrSrv.sin_port = htons(port);
	int err = bind(sockSrv, (SOCKADDR*)&addrSrv, sizeof(SOCKADDR));

	if (err) {
		printf("Bind port(%d) failed, return value(%d), error (%d) \n", port, err, GetLastError());
	}

	return sockSrv;
}

void compress(frameInfo info, unsigned char *buf) {
	int srcindex = 0, dstindex = 0;
	char *tmp = new char[HEAD_SIZE+info.w*info.h * 4];
	memcpy(tmp, buf, HEAD_SIZE + info.w*info.h * 4);
	buf[HEAD_SIZE - 1] = (info.resolutionWidth * 3)>>8;
	buf[HEAD_SIZE - 2] = info.resolutionWidth * 3;
	for (int i = 0; i < info.h; ++i) {
		for (int j = 0; j < info.w; ++j) {
			dstindex = HEAD_SIZE + (i * info.w + j) * 3;
			srcindex = HEAD_SIZE + (i*info.w + j) * 4;
			buf[dstindex] = tmp[srcindex];
			buf[dstindex + 1] = tmp[srcindex + 1];
			buf[dstindex + 2] = tmp[srcindex + 2];
		}
	}
}
void updateFrame(frameInfo info, unsigned char *buf) {
	if (finfo.resolutionHeight == 0) {//ave first frame
		if ((info.resolutionHeight != info.h) ||
			(info.resolutionWidth != info.w)) {
			std::cout << " resolution change ,but recv frame data is not correct" << std::endl;
		}
		else {
			finfo = info;
			memcpy(frame, buf, HEAD_SIZE + info.resolutionHeight*info.resolutionWidth * 3);
		}
	}
	else if ((finfo.resolutionHeight != info.resolutionHeight) ||
		(finfo.resolutionWidth) != info.resolutionWidth) {
		if ((info.resolutionHeight != info.w) ||
			(info.resolutionWidth != info.h)) {
			std::cout << " resolution change ,but recv frame data is not correct" << std:: endl;
		}
		else {// save the new frame
			finfo = info;
			memcpy(frame, buf, HEAD_SIZE + info.resolutionHeight*info.resolutionWidth * 3);
		}
	}
	else {//update frame
		int srcindex = 0, dstindex = 0;
		for (int i = 0; i < info.h; ++i) {
			for (int j = 0; j < info.w; ++j) {
				dstindex = HEAD_SIZE + ((info.y + i)*finfo.w + info.x + j) * 3;
				srcindex = HEAD_SIZE + (i*info.w + j) * 3;
				frame[dstindex] = buf[srcindex];
				frame[dstindex + 1] = buf[srcindex + 1];
				frame[dstindex + 2] = buf[srcindex + 2];
			}
		}
	}
}

int RTAVConnectionVideoThread(void)
{
	// Bind port 10001 and send video frame to peer
	printf("%s(): create socket for RTAV video, port:%d.\n", __FUNCTION__, RTAV_VIDEO_PORT);
	SOCKET sockSrv = CreateAndBind(RTAV_VIDEO_PORT);


	int requestCount = 0;

	listen(sockSrv, 5);

	SOCKADDR_IN addrClient;
	int len = sizeof(SOCKADDR);
	printf("RTAV video thread is running .....\n");
	while (true)
	{
		SOCKET sockConn = accept(sockSrv, (SOCKADDR *)&addrClient, &len);
		printf("%s(): new RTAV video connection.\n", __FUNCTION__);
		char recvchar[100];
		while (true) {
			// Loop for sending the video data
			// Only send data when RTAV is reuesting frames
			if (requestCount <= 0) {
				recv(sockConn, recvchar, 100, 0);
				requestCount++;
			}
			if (g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize > 0) {
				send(sockConn, g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].data,
					g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize, 0);

				g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize = 0;
				g_videoBuffer.nextReadIndex = GetNextIndex(g_videoBuffer.nextReadIndex, 3);
				requestCount--;
			}
			else {
				// No data Currently, just wait data coming and send
				Sleep(1);
			}
		}
		closesocket(sockConn);
	}

	closesocket(sockSrv);
	std::cout << "thead out" << std::endl;
	return 0;
}


int RTAVConnectionAudioThread(void)
{
	// Bind port 10002 and send audio frame to peer
	printf("%s(): create socket for RTAV audio, port: %d.\n", __FUNCTION__, RTAV_AUDIO_PORT);
	SOCKET sockSrv = CreateAndBind(RTAV_AUDIO_PORT);

	int requestCount = 0;
	listen(sockSrv, 5);

	SOCKADDR_IN addrClient;
	int len = sizeof(SOCKADDR);
	printf("RTAV audio thread is running .....\n");
	while (true)
	{
		SOCKET sockConn = accept(sockSrv, (SOCKADDR *)&addrClient, &len);
		printf("%s(): new RTAV audio connection.\n", __FUNCTION__);
		char recvchar[100];
		while (true) {
			// Loop for sending the AUDIO data
			if (requestCount <= 0) {
				recv(sockConn, recvchar, 100, 0);
				requestCount++;
			}
			if (g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize > 0) {
				send(sockConn, g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].data,
					g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize, 0);
				g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize = 0;
				g_audioBuffer.nextReadIndex = GetNextIndex(g_audioBuffer.nextReadIndex, 10);
				requestCount--;
			}
			else {
				// Wait data
				Sleep(1);
			}
		}
		closesocket(sockConn);
	}
	closesocket(sockSrv);
	return 0;
}

//send message to mks client
int sendtoMKS(std::string message) {
	return send(sockEventConn, message.c_str(), message.length(),0);
}


int SHAREConnectioScreenThread(void)
{
	printf("%s(): create socket for screen data transfer, port:%d .\n", __FUNCTION__, SCREEN_PORT);
	printf("%s(): create socket for event data transfer, port:%d .\n", __FUNCTION__, MKS_PORT);
	SOCKET sockSrvdata = CreateAndBind(SCREEN_PORT);
	SOCKET sockSrvevent = CreateAndBind(MKS_PORT);
	listen(sockSrvdata, 2);
	listen(sockSrvevent, 2);

	SOCKADDR_IN addrDataClient;
	int lenf = sizeof(SOCKADDR);
	SOCKET sockConn = accept(sockSrvdata, (SOCKADDR *)&addrDataClient, &lenf);
	printf("viewclient connected 10006 .....\n");

	SOCKADDR_IN addrEventClient;
	int leng = sizeof(SOCKADDR);
	//sockEventConn = accept(sockSrvevent, (SOCKADDR *)&addrEventClient, &leng);
	printf("viewclient connected 10003 .....\n");

	frame = new unsigned char[2840 * 2550 * 4];
	unsigned char* buf = new unsigned char[2840 * 2550 * 4];
	unsigned char* tmpbuf = new unsigned char[2840 * 2550 * 4];
	//SOCKADDR_IN* tmp = (SOCKADDR_IN*)&addrClient;
	// print the ip and port of the viewclient
	//printf("hhh:%s\n", inet_ntoa(tmp->sin_addr));
	//printf("hhh:%d\n", tmp->sin_port);
	while (true) {

		auto send_stream =std:: make_shared<WssServer::SendStream>();
		unsigned int len = 0;
		unsigned int numbytes = 4;
		int reclen = 0;
		while (reclen < numbytes) {
			unsigned char *lenbuf = new unsigned char[numbytes];
			int numrecv = 0;
			reclen = 0;
			numrecv = recv(sockConn, (char*)lenbuf, numbytes - reclen, 0);
			if (numrecv <= 0) {
				std::cout << __FUNCTION__ << "socket read error" << std::endl;
				return 1;
			}
			else {
				memcpy(&buf[reclen], lenbuf, numrecv);
				reclen += numrecv;
			}
		}
		for (unsigned int i = 0; i < numbytes; ++i) {
			//cout << hex << (int)(unsigned char)buf[i] << endl;
			len += buf[i] << (8 * (numbytes - 1 - i));
		}
		//cout << "revc len :" << len << endl;
		reclen = 0;
		while (reclen < len) {
			int numrev = recv(sockConn, (char*)tmpbuf, len - reclen, 0);
			if (numrev <= 0) {
				//cout << __FUNCTION__ << "socket read error" << endl;
				return 1;
			}
			else {
				memcpy(&buf[reclen], tmpbuf, numrev);
				reclen += numrev;
			}
		}
		//for(int i = 0; i < 30; i++)
		//	cout << hex << (int)buf[i] << endl;
		frameInfo info;
		/*
		* big endian to little endian
		info.resolutionWidth = (buf[0] << 8) +buf[1];
		info.resolutionHeight = (buf[2] << 8) + buf[3];
		info.x = (buf[4] << 8) + buf[5];
		info.y =(buf[6] << 8) + buf[7];
		info.w = (buf[8] << 8) + buf[9];
		info.h = (buf[10] << 8) + buf[11];
		*/
		info.resolutionWidth = (buf[1] << 8) + buf[0];
		info.resolutionHeight = (buf[3] << 8) + buf[2];
		info.x = (buf[5] << 8) + buf[4];
		info.y = (buf[7] << 8) + buf[6];
		info.w = (buf[9] << 8) + buf[8];
		info.h = (buf[11] << 8) + buf[10];
		//cout <<dec<< info.resolutionHeight << endl;
		//cout << info.resolutionWidth << endl;
		//cout << info.w << endl;
		compress(info, buf);
		updateFrame(info, buf);
		send_stream->write((char*)buf, HEAD_SIZE + info.w*info.h * 3);
		for (auto &c : echo->get_connections())
			c->send(send_stream);
		///while (true);
	}
	closesocket(sockSrvdata);
	closesocket(sockSrvevent);
	return 0;
}
/*
int SHAREConnectioScreenThread(void)
{
	printf("%s(): create socket for screen data transfer, port:%d .\n", __FUNCTION__, SCREEN_PORT);
	SOCKET sockSrv = CreateAndBind(SCREEN_PORT);
	std::vector<std::thread> thrpool(5);
	listen(sockSrv, 5);

	SOCKADDR_IN addrClient;
	int len = sizeof(SOCKADDR);

	printf("screen data transfer thread is running .....\n");

	while (true)
	{
		SOCKET sockConn = accept(sockSrv, (SOCKADDR *)&addrClient, &len);
		printf("%s(): new view-client screen sharing connection.\n", __FUNCTION__);
		thrpool.push_back(std::thread([sockConn]() {
			char* buf = new char[2840*2550*4];
			while (true) {
				std::cout << "thread created" << std::endl;
				recv(sockConn, buf, 4, 0);
				int len = buf[0] + buf[1] * 256 + buf[2] * 256 * 256 + buf[3] * 256 * 256 * 256;
				std::cout << "revc len: " << len << std::endl;
				recv(sockConn, buf, len - 4, 0);

			}}));
	}
	closesocket(sockSrv);
	return 0;
}*/
/*
int BrowserConnectionAudioThread(void)
{
// Bind port 11002 and recieve audio from web
printf("%s(): create socket for broswer audio, port: %d .\n", __FUNCTION__, WEB_AUDIO_PORT);
SOCKET sockSrv = CreateAndBind(WEB_AUDIO_PORT);

listen(sockSrv, 5);

SOCKADDR_IN addrClient;
int len = sizeof(SOCKADDR);
printf("Browser audio thread is running .....\n");
while (!g_quit)
{
SOCKET sockConn = accept(sockSrv, (SOCKADDR *)&addrClient, &len);
//printf("%s(): new broswer audio connection.\n", __FUNCTION__);
while (!g_quit) {
// Loop for recieving the AUDIO data
AudioFrame* aframe = &(g_audioBuffer.audioFrames[g_audioBuffer.nextWriteIndex]);
int re = recv(sockConn, aframe->data, 1440, 0);
if (re > 0) {
aframe->dwsize = re;
g_audioBuffer.nextWriteIndex = GetNextIndex(g_audioBuffer.nextWriteIndex, 10);
if (g_audiolog) {
printf("--- audio packet recieved(%d bytes) ---", re);
}
} else {
break;
}
//send(sockConn,sendbuffer,strlen(sendbuffer)+1,0);
}
closesocket(sockConn);
}
closesocket(sockSrv);
return 0;
}

*/

int data_swither_start()
{
	InitBuffers();
	std::thread RTAVVideoThread(RTAVConnectionVideoThread);
	std::thread RTAVAudioThread(RTAVConnectionAudioThread);
	std::thread SHAREScreenThread(SHAREConnectioScreenThread);
	RTAVAudioThread.join();
	RTAVVideoThread.join();
	SHAREScreenThread.join();
	return 0;
}

