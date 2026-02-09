const Thread = require("../models/Thread");
const Message = require("../models/Message");

exports.createThread = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ msg: "All fields are required!" });

    // Find existing thread
    let thread = await Thread.findOne({ userEmail: email });

    // If thread doesn't exist, create it
    if (!thread) {
      thread = await Thread.create({
        userName: name,
        userEmail: email,
        unreadForAdmin: 0, // start at 0, we will increment below
      });
    }

    // Save the message
    const newMessage = await Message.create({
      threadId: thread._id,
      message,
      fromAdmin: false,
      createdAt: new Date(),
    });

    // Update thread
    thread.lastMessage = message;
    thread.lastMessageAt = new Date();

    // Increment unread only if message is from user (not admin)
    thread.unreadForAdmin += 1;

    await thread.save();

    res.status(201).json({
      msg: "Message received",
      threadId: thread._id,
      messageId: newMessage._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};
