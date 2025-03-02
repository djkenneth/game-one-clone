import { Elysia, t } from 'elysia';
import { prisma } from '../index';
import { auth, isAuth } from '../plugins/auth';
import { NotFoundError, UnauthorizedError } from '../utils/errors';
import { AddressType, ProfileInputSchema } from '@/schema/users';

export const userRouter = new Elysia({ prefix: '/users' })
  // Profile routes
  .group('/profile', app =>
    app
      .use(auth)

      .post(
        '/',
        async ({ body, user }) => {
          if (!user) {
            throw new UnauthorizedError('User not authenticated');
          }

          const profileData = {
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            birthDate: new Date(body.birthDate),
            age: parseInt(body.age),
            profilePicture: body.profilePicture,
            userId: user.id,
          };

          const profile = await prisma.profile.create({
            data: profileData,
          });

          console.log('profile', profile);

          return {
            success: true,
            data: { profile },
          };
        },
        {
          onBeforeHandle: [auth, isAuth],
          body: ProfileInputSchema,
          detail: {
            tags: ['Profile Management'],
            summary: 'Create user profile',
            description: 'Create a new profile for the user',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .get(
        '/',
        async ({ user }) => {
          const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
          });

          if (!profile) {
            throw new NotFoundError('Profile not found');
          }

          return {
            success: true,
            data: { profile },
          };
        },
        {
          detail: {
            tags: ['Profile Management'],
            summary: 'Get user profile',
            description: 'Retrieve user profile information',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .put(
        '/',
        async ({ body, user }) => {
          try {
            if (!user) {
              throw new UnauthorizedError('User not authenticated');
            }

            const profileData = {
              firstName: body.firstName,
              middleName: body.middleName,
              lastName: body.lastName,
              birthDate: new Date(body.birthDate),
              age: parseInt(body.age),
              profilePicture: body.profilePicture,
            };

            const profile = await prisma.profile.update({
              where: { userId: user.id },
              data: profileData,
            });

            return {
              success: true,
              data: { profile },
            };
          } catch (error) {
            throw new NotFoundError('Profile not found');
          }
        },
        {
          body: ProfileInputSchema,
          detail: {
            tags: ['Profile Management'],
            summary: 'Update user profile',
            description: 'Update existing user profile information',
            security: [{ bearerAuth: [] }],
          },
        }
      )
  )

  // Address routes
  .group('/address', app =>
    app
      .post(
        '/',
        async ({ body, user }) => {

          if (!user) {
            throw new UnauthorizedError('User not authenticated');
          }

          const addressData = {
            lineOne: body.lineOne,
            lineTwo: body.lineTwo,
            city: body.city,
            country: body.country,
            pincode: body.pincode,
            userId: user.id,
          };

          const address = await prisma.address.create({
            data: addressData,
          });

          return {
            success: true,
            data: { address },
          };
        },
        {
          body: AddressType,
          detail: {
            tags: ['Address Management'],
            summary: 'Create new address',
            description: 'Add a new address to user profile',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .get(
        '/',
        async ({ user }) => {
          if (!user) {
            throw new UnauthorizedError('User not authenticated');
          }

          const addresses = await prisma.address.findMany({
            where: { userId: user.id },
          });

          return {
            success: true,
            data: { addresses },
          };
        },
        {
          detail: {
            tags: ['Address Management'],
            summary: 'List user addresses',
            description: 'Get all addresses associated with the user',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .delete(
        '/:id',
        async ({ params: { id }, user }) => {
          try {
            if (!user) {
              throw new UnauthorizedError('User not authenticated');
            }

            const address = await prisma.address.findFirst({
              where: {
                id: parseInt(id),
                userId: user.id,
              },
            });

            if (!address) {
              throw new NotFoundError('Address not found');
            }

            await prisma.address.delete({
              where: { id: parseInt(id) },
            });

            return {
              success: true,
              message: 'Address deleted successfully',
            };
          } catch (error) {
            throw new NotFoundError('Address not found');
          }
        },
        {
          detail: {
            tags: ['Address Management'],
            summary: 'Delete address',
            description: 'Remove an address from user profile',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .put(
        '/:id',
        async ({ params: { id }, body, user }) => {

          if (!user) {
            throw new UnauthorizedError('User not authenticated');
          }

          try {
            // Check if address belongs to user
            const address = await prisma.address.findFirst({
              where: {
                id: parseInt(id),
                userId: user.id,
              },
            });

            if (!address) {
              throw new NotFoundError('Address not found');
            }

            const addressData = {
              lineOne: body.lineOne,
              lineTwo: body.lineTwo,
              city: body.city,
              country: body.country,
              pincode: body.pincode,
            };

            // Update address
            const updatedAddress = await prisma.address.update({
              where: { id: parseInt(id) },
              data: addressData
            });

            return {
              success: true,
              data: { address: updatedAddress },
            };
          } catch (error) {
            if (error instanceof NotFoundError) {
              throw error;
            }
            throw new NotFoundError('Address not found');
          }
        },
        {
          body: AddressType,
          detail: {
            tags: ['Address Management'],
            summary: 'Update address',
            description: 'Update an existing address for the user',
            security: [{ bearerAuth: [] }],
          },
        }
      )
  )

  // Admin routes
  .group('/admin', app =>
    app

      .get(
        '/',
        async ({ query }) => {
          const { skip = '0', take = '10' } = query;

          const users = await prisma.user.findMany({
            skip: parseInt(skip as string),
            take: parseInt(take as string),
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          });

          const total = await prisma.user.count();

          return {
            success: true,
            data: {
              users,
              total,
              page: Math.floor(parseInt(skip as string) / parseInt(take as string)) + 1,
              pageSize: parseInt(take as string),
            },
          };
        },
        {
          query: t.Object({
            skip: t.Optional(t.String()),
            take: t.Optional(t.String()),
          }),
          detail: {
            tags: ['User Management (Admin)'],
            summary: 'List all users',
            description: 'Admin endpoint to list all users with pagination',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .get(
        '/:id',
        async ({ params: { id } }) => {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
              addresses: true,
              profile: true,
            },
          });

          if (!user) {
            throw new NotFoundError('User not found');
          }

          return {
            success: true,
            data: { user },
          };
        },
        {
          detail: {
            tags: ['User Management (Admin)'],
            summary: 'Get user details',
            description: 'Admin endpoint to get detailed user information',
            security: [{ bearerAuth: [] }],
          },
        }
      )

      .put(
        '/:id/role',
        async ({ params: { id }, body }) => {
          try {
            const user = await prisma.user.update({
              where: { id: parseInt(id) },
              data: {
                role: body.role,
              },
            });

            return {
              success: true,
              data: { user },
            };
          } catch (error) {
            throw new NotFoundError('User not found');
          }
        },
        {
          body: t.Object({
            role: t.Enum({ ADMIN: 'ADMIN', USER: 'USER' }),
          }),
          detail: {
            tags: ['User Management (Admin)'],
            summary: 'Change user role',
            description: 'Admin endpoint to update user role',
            security: [{ bearerAuth: [] }],
          },
        }
      )
  );
