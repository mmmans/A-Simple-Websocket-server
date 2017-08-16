#ifndef _DATASWITHER_H
#define _DATASWITHER_H

#pragma comment(lib, "Ws2_32.lib")
#include <WinSock2.h>
#include <stdio.h>
#include <iostream>
#include <WS2tcpip.h>
#include <process.h>

#define RTAV_VIDEO_PORT 10001
#define RTAV_AUDIO_PORT 10002
#define WEB_VIDEO_PORT  11002
#define WEB_AUDIO_PORT  11001

bool g_quit = false;
bool g_videolog = false;
bool g_audiolog = false;

int data_swither_start();

#endif

