import { Injectable, Logger } from '@nestjs/common';
import { UploadProcessor } from './upload-processor.service';

@Injectable()
export class UploadQueueService {
    private readonly logger = new Logger(UploadQueueService.name);

    constructor(private readonly processor: UploadProcessor) { }

    async addUploadJob(fileData: any, companyId: string) {
        this.logger.log(`Received upload for company ${companyId} (Sync Mode)`);

        // In Serverless/MVP mode, we process immediately.
        const result = await this.processor.processSync({ fileData, companyId });

        return { status: 'processed', message: 'File processed successfully', result };
    }
}
