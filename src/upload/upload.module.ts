import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
  imports: [DBModule],
})
export class UploadModule {}
