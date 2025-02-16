import { Elysia, t } from 'elysia';
import { prisma } from '../index';
import { auth, isAuth } from '../plugins/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';
import { AddressType, ProfileInputSchema, UpdateUserSchema, UpdateUsersType } from '@/schema/users';

export const userRouter = new Elysia({ prefix: '/users' })
  // Profile routes
  .group('/profile', app =>
    app
      .use(auth)

      .post(
        '/',
        async ({ body, user }) => {
          console.log('user', user);
          console.log(body);

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
            const profile = await prisma.profile.update({
              where: { userId: user.id },
              data: body,
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
          const address = await prisma.address.create({
            data: {
              ...AddressType.parse(body),
              userId: user.id,
            },
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
        '/',
        async ({ body, user }) => {
          const data = UpdateUserSchema.parse(body);

          if (data.defaultShippingAddress) {
            const address = await prisma.address.findFirst({
              where: {
                id: data.defaultShippingAddress,
                userId: user.id,
              },
            });

            if (!address) {
              throw new BadRequestError('Invalid shipping address');
            }
          }

          if (data.defaultBillingAddress) {
            const address = await prisma.address.findFirst({
              where: {
                id: data.defaultBillingAddress,
                userId: user.id,
              },
            });

            if (!address) {
              throw new BadRequestError('Invalid billing address');
            }
          }

          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data,
          });

          return {
            success: true,
            data: { user: updatedUser },
          };
        },
        {
          body: UpdateUsersType,
          detail: {
            tags: ['Address Management'],
            summary: 'Update user settings',
            description: 'Update user preferences and default addresses',
            security: [{ bearerAuth: [] }],
          },
        }
      )
  )

  // Admin routes
  .group('/admin', app => app

    .get('/',
      async ({ query }) => {
        const { skip = '0', take = '10' } = query

        const users = await prisma.user.findMany({
          skip: parseInt(skip as string),
          take: parseInt(take as string),
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })

        const total = await prisma.user.count()

        return {
          success: true,
          data: {
            users,
            total,
            page: Math.floor(parseInt(skip as string) / parseInt(take as string)) + 1,
            pageSize: parseInt(take as string)
          }
        }
      },
      {
        query: t.Object({
          skip: t.Optional(t.String()),
          take: t.Optional(t.String())
        }),
        detail: {
          tags: ['User Management (Admin)'],
          summary: 'List all users',
          description: 'Admin endpoint to list all users with pagination',
          security: [{ bearerAuth: [] }]
        }
      }
    )

    .get('/:id',
      async ({ params: { id } }) => {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: {
            addresses: true,
            profile: true
          }
        })

        if (!user) {
          throw new NotFoundError('User not found')
        }

        return {
          success: true,
          data: { user }
        }
      },
      {
        detail: {
          tags: ['User Management (Admin)'],
          summary: 'Get user details',
          description: 'Admin endpoint to get detailed user information',
          security: [{ bearerAuth: [] }]
        }
      }
    )

    .put('/:id/role',
      async ({ params: { id }, body }) => {
        try {
          const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
              role: body.role
            }
          })

          return {
            success: true,
            data: { user }
          }
        } catch (error) {
          throw new NotFoundError('User not found')
        }
      },
      {
        body: t.Object({
          role: t.Enum({ ADMIN: 'ADMIN', USER: 'USER' })
        }),
        detail: {
          tags: ['User Management (Admin)'],
          summary: 'Change user role',
          description: 'Admin endpoint to update user role',
          security: [{ bearerAuth: [] }]
        }
      }
    )
  );
