import {
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/db/schema/users';
import { UploadService } from './upload.service';
import { DB } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(DB) private db: NodePgDatabase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const user: User = req.user;
    return this.uploadService.uploadFile({ file, user });
  }

  @Put(':key')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  replaceFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('key') key: string,
    @Req() req,
  ) {
    const user: User = req.user;
    return this.uploadService.replaceFile({
      key,
      file,
      user,
    });
  }

  @Delete(':key')
  @UseGuards(AuthGuard('jwt'))
  deleteFile(@Param('key') key: string) {
    return this.uploadService.removeFile(key);
  }
}
