#ifndef _DATASWITHER_H
#define _DATASWITHER_H
#include <WinSock2.h>
#include <stdio.h>
#include <iostream>
#include <WS2tcpip.h>
#include <process.h>
#include <thread>
#pragma comment(lib,"Ws2_32.lib")
#define RTAV_VIDEO_PORT 10001
#define RTAV_AUDIO_PORT 10002
#define WEB_VIDEO_PORT  11002
#define WEB_AUDIO_PORT  11001

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

extern const unsigned long DEFAULT_VIDEO_FRAME_SIZE = 1024 * 768 * 4;
extern const unsigned long DEFAULT_AUDIO_FRAEM_SIZE = 8000 * 2 * 2 * 10; // 8K HZ, double channel

extern int GetNextIndex(int CurrentIndex, int moder);
extern void InitBuffers();
extern SOCKET CreateAndBind(int port);
extern int RTAVConnectionAudioThread(void);
extern int RTAVConnectionVideoThread(void);
extern int data_swither_start();

#endif

