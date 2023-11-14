// import asyncHandler from "express-async-handler";
// import Boards from "../models/boards.js";
// // import User from "../models/users.js";
// import Cards from "../models/cards.js";
// import { conn } from "../config/db.js";

// //@desc Create a Card
// //route POST /api/c/boards/:boardId/cards
// //@access PRIVATE

// const createCard = asyncHandler(async (req, res) => {
//   const { boardId } = req.params;
//   const { title } = req.body;

//   const session = await conn.startSession();

//   try {
//     session.startTransaction();

//     const card = await Cards.create(
//       [
//         {
//           title,
//         },
//       ],
//       { session }
//     );

//     await Boards.updateOne(
//       { _id: boardId },
//       { $push: { cards: card } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({ message: "Card Created.." });
//   } catch (error) {
//     await session.abortTransaction();
//     throw new Error(error.message);
//   }
//   session.endSession();
// });

// //@desc Delete a Card
// //route POST /api/c/boards/:boardId/cards/:cardId
// //@access PRIVATE

// const deleteCard = asyncHandler(async (req, res) => {
//   const { boardId, cardId } = req.params;

//   const session = await conn.startSession();

//   try {
//     session.startTransaction();

//     await Boards.updateOne(
//       { _id: boardId },
//       { $pull: { cards: cardId } },
//       { session }
//     );

//     await Cards.findByIdAndDelete(cardId, { session });

//     await session.commitTransaction();

//     res.status(200).json({ message: "Card Deleted.." });
//   } catch (error) {
//     await session.abortTransaction();
//     throw new Error(error.message);
//   }
// });

// export { createCard, deleteCard };
