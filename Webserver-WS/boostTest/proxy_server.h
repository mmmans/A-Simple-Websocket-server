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
#include <vector>
#pragma comment(lib,"Ws2_32.lib")
#define RTAV_VIDEO_PORT 10001
#define RTAV_AUDIO_PORT 10002
#define SCREEN_PORT  10006
#define MKS_PORT  10003

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


extern const unsigned long DEFAULT_VIDEO_FRAME_SIZE;
extern const unsigned long DEFAULT_AUDIO_FRAEM_SIZE; // 8K HZ, double channel

extern int GetNextIndex(int CurrentIndex, int moder);
extern void InitBuffers();
extern SOCKET CreateAndBind(int port);
extern int RTAVConnectionAudioThread(void);
extern int RTAVConnectionVideoThread(void);
extern int SHAREConnectioScreenThread(void);
//extern int SHAREConnectioeventThread(void);
extern int data_swither_start();

extern int proxy_server_start();
#endif // !_PROXY_SERVER_H
