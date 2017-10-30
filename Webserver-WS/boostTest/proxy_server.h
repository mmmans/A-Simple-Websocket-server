#pragma once
#ifndef _PROXY_SERVER_H
#define _PROXY_SERVER_H
#include <WinSock2.h>
#include <stdio.h>
#include <iostream>
#include <WS2tcpip.h>
#include <process.h>
#include <thread>
#include <cstring>
#include <string>
#include <vector>
#include "server_wss.hpp"
#include "server_https.hpp"
#pragma comment(lib,"Ws2_32.lib")
#define RTAV_VIDEO_PORT 10001
#define RTAV_AUDIO_PORT 10002
#define SCREEN_PORT  10006
#define MKS_PORT  10003
#define HEAD_SIZE 14
#define SOCK_SIZE 10000
typedef struct frameinfo{
	unsigned short resolutionWidth;
	unsigned short resolutionHeight;
	unsigned short x;
	unsigned short y;
	unsigned short w;
	unsigned short h;
	frameinfo() {
		resolutionWidth = 0;
		resolutionHeight = 0;
		x = 0;
		y = 0;
		w = 0;
		h = 0;
	}
}frameInfo;
typedef struct {
	unsigned long dwsize;
	unsigned long dwMaxSize;
	char * data;
}VideoFrame;

typedef struct {
	unsigned long dwsize;
	unsigned long dwMaxSize;
	char* data;
}AudioFrame;

typedef struct {
	VideoFrame videoFrames[3];
	int nextReadIndex;
	int nextWriteIndex;
}VideoBuffer;

typedef struct {
	AudioFrame audioFrames[10];
	int nextReadIndex;
	int nextWriteIndex;
}AudioBuffer;

extern AudioBuffer g_audioBuffer;
extern VideoBuffer g_videoBuffer;
extern unsigned char *frame;
extern frameInfo finfo;
extern SOCKET sockEventConn;
typedef SimpleWeb::SocketServer<SimpleWeb::WSS> WssServer;
typedef SimpleWeb::Server<SimpleWeb::HTTPS> HttpsServer;
extern WssServer::Endpoint *echo;
extern const unsigned long DEFAULT_VIDEO_FRAME_SIZE;
extern const unsigned long DEFAULT_AUDIO_FRAEM_SIZE; // 8K HZ, double channel

extern int GetNextIndex(int CurrentIndex, int moder);
extern void InitBuffers();
extern SOCKET CreateAndBind(int port);
extern void compress(frameInfo info,unsigned char *buf);
extern void updateFrame(frameInfo info,unsigned char *buf);
extern int RTAVConnectionAudioThread(void);
extern int RTAVConnectionVideoThread(void);
extern int SHAREConnectioScreenThread(void);
extern int sendtoMKS(std::string message);
//extern int SHAREConnectioeventThread(void);
extern int data_swither_start();


#endif // !_PROXY_SERVER_H
