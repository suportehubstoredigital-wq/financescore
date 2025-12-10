import { Test, TestingModule } from '@nestjs/testing';
import { UploadQueueService } from './upload-queue.service';

describe('UploadQueueService', () => {
  let service: UploadQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadQueueService],
    }).compile();

    service = module.get<UploadQueueService>(UploadQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
