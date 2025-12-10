import { Test, TestingModule } from '@nestjs/testing';
import { UploadProcessorService } from './upload-processor.service';

describe('UploadProcessorService', () => {
  let service: UploadProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadProcessorService],
    }).compile();

    service = module.get<UploadProcessorService>(UploadProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
