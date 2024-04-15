import { rootConfigNoIoC } from '~common/config/config.module';
import { PrismaService } from '~vendor/prisma/prisma.service';

PrismaService.generateEnvFile(rootConfigNoIoC.prisma);
