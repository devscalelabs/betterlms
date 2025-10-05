import * as jose from "jose";

export async function generateToken(userId: string): Promise<string> {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	const token = await new jose.SignJWT({ id: userId })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("7d")
		.sign(secret);

	return token;
}

export async function verifyToken(token: string): Promise<string> {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	const decoded = await jose.jwtVerify(token, secret);
	return decoded.payload.id as string;
}
