import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
const { ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRY } = process.env;
import usersRepository from "../v1/components/users/users.repository";
import { BadRequestError, UnauthorizedError } from "../../utils/api-errors";

// Sign Access Token: JWT signed, to be used for authenticating users
export const signAccessToken = async({userId}: {userId:string}) => {
    const options = {expiresIn: ACCESS_TOKEN_EXPIRY, audience: userId}
    return jwt.sign({}, ACCESS_TOKEN_KEY as string, options);
};

export const authorize = () => {
    return [
        // Authenticate user, and attach user to request object (req.authUser)
        (req:Request, res:Response, next:NextFunction) => {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) return next(new UnauthorizedError(`unauthenticated, please try logging in again`));

            jwt.verify(token, ACCESS_TOKEN_KEY!, {}, async (err:any, payload:any) => {
                if (err) return next(new UnauthorizedError(`Your session has expired, login to continue`));

                let userId = payload?.aud;
                let user;
                try {
                    user = await usersRepository.getUserById({userId});
                } catch (err) {
                    return next(new BadRequestError(`User not found.`));
                }

                req.authUser = user;
                next()
            });
        },
    ];
};


