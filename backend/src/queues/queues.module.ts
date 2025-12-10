import { Module } from '@nestjs/common';
import { UploadQueueService } from './upload-queue.service';
import { UploadProcessor } from './upload-processor.service';

@Module({
  providers: [UploadQueueService, UploadProcessor],
  exports: [UploadQueueService],
})
export class QueuesModule { }
