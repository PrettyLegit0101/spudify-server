import prisma from "../../prisma/prisma";

export default async function requestHandler(req, res) {
  const { method } = req;
  const { RANDOM_SHA } = process.env;
  const { authorization } = req.headers;

  if (authorization !== `Bearer ${RANDOM_SHA}`) {
    return res.status(401).json({ error: "Unauthorized", success: false });
  }

  switch (method) {
    case "GET":
      return await getUser(req, res);
    case "POST":
      return await createUser(req, res);
    default:
      return res
        .status(405)
        .json({ error: "Method not allowed", success: false });
  }
}

// A get request to /api/user will returns a specific user
async function getUser(req, res) {
  const { email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return res.status(200).json(user, { success: true });
  } catch (e) {
    console.error("Request error", e);
    return res.status(500).json({
      error: `Error fetching user with email: ${req.query.email}`,
      success: false,
    });
  }
}

// A post request to /api/user will create a new user
async function createUser(req, res) {
  const body = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });
    return res.status(200).json(user, { success: true });
  } catch (e) {
    console.error("Request error", e);
    return res.status(500).json({
      error: `Error creating user with email: ${req.body.email}`,
      success: false,
    });
  }
}