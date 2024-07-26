import getPrismaInstance from "../utils/PrismaClient.js";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          receiver: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, receiver: true },
      });
      res.json({ status: true, message: newMessage });
    } else {
      res.json({
        status: false,
        message: "Invalid request, From & To are required...",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            receiverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            receiverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    console.log(messages);
    const unreadMessages = [];
    messages.forEach((message, index) => {
      console.log("in the loop", message, to);
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        console.log(true);
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });
    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};
