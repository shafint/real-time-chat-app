const userModal = require("../schema/usersList");
const conversectionModel = require("../schema/conversetionSchema");
const messageModel = require("../schema/messageSchema");
const path = require("path");
const { unlink } = require("fs");
//get users
async function dashboard(req, res) {
  try {
    if (Object.keys(req.body.user).length > 0) {
      if (req.body.user.roll === "admin") {
        const AdminUser = await userModal.findOne({
          $and: [
            { email: req.body.user.email },
            { phone: req.body.user.phone },
            { roll: req.body.user.roll },
          ],
        });
        if (AdminUser.roll === "admin") {
          const allUser = await userModal.find({});
          if (allUser.length > 0) {
            res.status(200).json({ data: allUser });
          } else {
            throw new Error("You are not Admin");
          }
        } else {
          throw new Error("You are not Admin");
        }
      } else {
        throw new Error("You are not Admin");
      }
    } else {
      throw new Error("You are not Admin");
    }
  } catch (err) {
    res.status(500).json({ errors: err });
  }
}

async function removeUser(req, res) {
  try {
    if (Object.keys(req.body.user).length > 0) {
      if (req.body.user.roll === "admin") {
        const AdminUser = await userModal.findOne({
          $and: [
            { email: req.body.user.email },
            { phone: req.body.user.phone },
            { roll: req.body.user.roll },
          ],
        });
        if (AdminUser.roll === "admin") {
          const deleteUser = await userModal.findByIdAndDelete({
            _id: req.body.userId,
          });
          if (Object.keys(deleteUser).length > 0) {
            const conv = await conversectionModel.deleteOne({
              $or: [
                { "creator.id": deleteUser._id },
                { "participant.id": deleteUser._id },
              ],
            });
            if (conv.deletedCount > 0) {
              const msgDlt = await messageModel.deleteMany({
                $or: [
                  { "sender.id": deleteUser._id },
                  { "receiver.id": deleteUser._id },
                ],
              });
            }

            if (Object.keys(deleteUser).length > 0) {
              if (deleteUser.avater) {
                unlink(
                  path.join(
                    __dirname,
                    `../public/avaterPhotos/${deleteUser.avater}`
                  ),
                  (err) => {
                    if (err) console.log(err);
                  }
                );
              }
              res.status(200).json({ data: deleteUser });
            }
          } else {
            throw new Error("Something wrrong please try again");
          }
        } else {
          throw new Error("You are not Admin");
        }
      } else {
        throw new Error("You are not Admin");
      }
    } else {
      throw new Error("You are not Admin");
    }
  } catch (err) {
    res.status(500).json({ errors: err });
  }
}

module.exports = { dashboard, removeUser };
