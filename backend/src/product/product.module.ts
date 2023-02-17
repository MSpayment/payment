import { Module } from "@nestjs/common";
import { ProductController } from "src/product/product.controller";
import { ProductService } from "src/product/product.service";

@Module({
  controllers: [ProductController],
  exports: [],
  imports: [],
  providers: [ProductService],
})
export class ProductModule {}
