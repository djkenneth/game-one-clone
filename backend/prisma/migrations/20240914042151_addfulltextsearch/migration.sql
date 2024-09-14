-- CreateIndex
CREATE FULLTEXT INDEX `Product_title_description_tags_idx` ON `Product`(`title`, `description`, `tags`);
