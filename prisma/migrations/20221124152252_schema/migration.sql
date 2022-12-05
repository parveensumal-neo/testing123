-- CreateTable
CREATE TABLE "Users" (
    "user_id" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "address1" VARCHAR(150) NOT NULL,
    "address2" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email_verification_code" VARCHAR(6) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_expiry" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "opt_counter" SMALLINT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Providers" (
    "provider_id" VARCHAR(255) NOT NULL,
    "provider_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "opt_counter" SMALLINT NOT NULL,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "User_providers" (
    "user_id" VARCHAR(255) NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_providers_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_name_key" ON "Users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Providers_provider_name_key" ON "Providers"("provider_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_providers_provider_id_key" ON "User_providers"("provider_id");
