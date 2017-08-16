// DataSwitcher.cpp : Defines the entry point for the console application.
//
#include "data_swither.h"
AudioBuffer g_audioBuffer;
VideoBuffer g_videoBuffer;
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

   for (int j = 0; j < 3;j++) {
      VideoFrame* vFrame= &(g_videoBuffer.videoFrames[j]);
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
			 requestCount ++;
		  }
         if (g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize > 0) {
            send(sockConn, g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].data,
               g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize, 0);

            g_videoBuffer.videoFrames[g_videoBuffer.nextReadIndex].dwsize = 0;
            g_videoBuffer.nextReadIndex = GetNextIndex(g_videoBuffer.nextReadIndex, 3);
			requestCount --;
		 } else {
			 // No data Currently, just wait data coming and send
			 Sleep(1);
		 }
      }
      closesocket(sockConn);
   }

   closesocket(sockSrv);
   std::cout << "thead out" <<std:: endl;
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
		  if(requestCount <=0) {
			  recv(sockConn, recvchar, 100, 0);
			  requestCount ++;
		  }
		 if(g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize > 0) {
			 send(sockConn, g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].data,
				 g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize, 0);
			 g_audioBuffer.audioFrames[g_audioBuffer.nextReadIndex].dwsize = 0;
			 g_audioBuffer.nextReadIndex = GetNextIndex(g_audioBuffer.nextReadIndex, 10);
			 requestCount --;
		 } else {
			 // Wait data
			 Sleep(1);
		 }
      }
      closesocket(sockConn);
   }
   closesocket(sockSrv);
   return 0;
}

/*

int BrowserConnectionVideoThread(void)
{
   printf("%s(): create socket for broswer video, port:%d .\n", __FUNCTION__, WEB_VIDEO_PORT);
   SOCKET sockSrv = CreateAndBind(WEB_VIDEO_PORT);

   listen(sockSrv, 5);

   SOCKADDR_IN addrClient;
   int len = sizeof(SOCKADDR);

   printf("Browser video thread is running .....\n");

   while (!g_quit)
   {
      SOCKET sockConn = accept(sockSrv, (SOCKADDR *)&addrClient, &len);
      printf("%s(): new broswer video connection.\n", __FUNCTION__);
      char recvchar[100];
      while (!g_quit) {
         // Loop for recieving the video data
         VideoFrame* aframe = &(g_videoBuffer.videoFrames[g_videoBuffer.nextWriteIndex]);
         int recieved = recv(sockConn, aframe->data, DEFAULT_VIDEO_FRAME_SIZE, 0);
         if (recieved > 0) {
            aframe->dwsize = recieved;
            g_videoBuffer.nextWriteIndex = GetNextIndex(g_videoBuffer.nextWriteIndex, 3);
            if (g_videolog) {
               printf("+++ recieved video frame(%d bytes) +++\n", recieved);
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
   RTAVAudioThread.join();
   RTAVVideoThread.join();
   return 0;
}

