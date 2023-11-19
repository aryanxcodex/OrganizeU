import asyncHandler from "express-async-handler";
import Cards from "../models/cards.js";
import Boards from "../models/boards.js";
import Tasks from "../models/tasks.js";

//@desc Create a Card
//route POST /api/c/create
//@access PRIVATE

const createCard = asyncHandler(async (req, res) => {
  // Deconstruct the body
  const { title, boardId } = req.body;
  // Validate the title
  if (!(title && boardId)) {
    throw new Error("Title cannot be empty");
  }
  // Validate whether boardId is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error(
      "You can not add a card to the board, you are not a member or owner!"
    );
  }

  try {
    // Create new Card
    const tempCard = await Cards({ title, owner: boardId });

    // Save the new Card
    const newCard = await tempCard.save();

    // Get owner board
    const ownerBoard = await Boards.findById(boardId);

    // Add newList's id to owner board
    ownerBoard.cards.push(newCard._id);

    // Save changes
    ownerBoard.save();

    res.status(200).json({ newCard, message: "Card Created.." });
  } catch (error) {
    res.status(500).send(error);
  }
});

//@desc Get all the cards
//route GET /api/c/:boardId
//@access PRIVATE

const getAllCards = asyncHandler(async (req, res) => {
  // Assuming parameter to constant
  const { boardId } = req.params;

  // Validate whether boardId is in the user's board or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error(
      "You cannot get cards, because you are not owner of this Board!"
    );
  }

  try {
    // Get cards whose owner id equals to boardId param
    let cards = await Cards.find({ owner: { $in: boardId } })
      .populate({ path: "tasks" })
      .exec();

    // Order the cards
    const board = await Boards.findById(boardId);
    let responseObject = board.cards.map((cardId) => {
      return cards.filter(
        (cardObject) => cardObject._id.toString() === cardId.toString()
      )[0];
    });

    res.status(200).json({ responseObject });
  } catch (error) {
    res.status(500).send(error);
  }
});

//@desc Update Card Title
//route PUT /:boardId/:cardId/update-title
//@access PRIVATE

const updateCardTitle = asyncHandler(async (req, res) => {
  // deconstruct the params
  const { cardId, boardId } = req.params;
  const user = req.user;
  const { title } = req.body;

  // Validate the cardId and boardId
  if (!(cardId && boardId)) {
    throw new Error("Card or board undefined");
  }

  try {
    // Get board to check the parent of card is this board
    const board = await Boards.findById(boardId);
    const card = await Cards.findById(cardId);
    // Validate the parent of the card
    const validate = board.cards.filter((card) => card.id === cardId);
    if (!validate) {
      throw new Error("Card or board informations are wrong");
    }
    // Validate whether the owner of the board is the user who sent the request.
    if (!user.boards.filter((board) => board === boardId)) {
      throw new Error(
        "You cannot update a card that is not hosted by your boards"
      );
    }

    // Change title of card
    card.title = title;
    await card.save();

    res.status(200).json({ message: "Success!", card });
  } catch (error) {
    res.status(500).send(error);
  }
});

//@desc Delete Card
//route DELETE /:boardId/:cardId
//@access PRIVATE

const deleteById = asyncHandler(async (req, res) => {
  // deconstruct the params
  const { cardId, boardId } = req.params;
  const user = req.user;

  // Validate the cardId and boardId
  if (!(cardId && boardId)) {
    throw new Error("Card or board undefined");
  }

  try {
    // Get board to check the parent of card is this board
    const board = await Boards.findById(boardId);

    // Validate the parent of the card
    const validate = board.cards.filter((card) => card.id === cardId);
    if (!validate) {
      throw new Error("Card or board informations are wrong");
    }

    // Validate whether the owner of the board is the user who sent the request.
    if (!user.boards.filter((board) => board === boardId)) {
      throw new Error(
        "You cannot delete a card that is not hosted by your boards"
      );
    }

    // Delete the card
    const result = await Cards.findByIdAndDelete(cardId);

    // Delete the card from cards of board
    board.cards = board.cards.filter((card) => card.toString() !== cardId);

    board.save();

    // Delete all tasks in the card
    await Tasks.deleteMany({ owner: cardId });

    res.status(200).json({ message: "Success!", result });
  } catch (error) {
    res.status(500).send(error);
  }
});

//@desc Update Task Order
//route PUT /change-task-order
//@access PRIVATE

const updateTaskOrder = asyncHandler(async (req, res) => {
  // deconstruct the params
  const { boardId, sourceId, destinationId, destinationIndex, taskId } =
    req.body;
  const user = req.user;

  // Validate the params
  if (!(boardId && sourceId && destinationId && taskId)) {
    throw new Error("All parameters not provided");
  }

  // Validate the owner of board
  const validate = user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error("You cannot edit the board of which you aren't a part of");
  }

  try {
    // Validate the parent board of the cards
    const board = await Boards.findById(boardId);
    let validate = board.cards.filter((card) => card.id === sourceId);
    const validate2 = board.cards.filter((card) => card.id === destinationId);
    if (!validate || !validate2) {
      throw new Error("Card or board informations are wrong");
    }

    // Validate the parent Card of the task
    const sourceCard = await Cards.findById(sourceId);
    validate = sourceCard.tasks.filter(
      (task) => task._id.toString() === taskId
    );
    if (!validate) {
      throw new Error("Card or task informations are wrong");
    }

    // Remove the task from source Card and save
    sourceCard.tasks = sourceCard.tasks.filter(
      (task) => task._id.toString() !== taskId
    );
    await sourceCard.save();

    // Insert the task to destination Card and save
    const task = await Tasks.findById(taskId);
    const destinationCard = await Cards.findById(destinationId);
    const temp = Array.from(destinationCard.tasks);
    temp.splice(destinationIndex, 0, taskId);
    destinationCard.tasks = temp;
    await destinationCard.save();

    // Change owner Card of task
    task.owner = destinationId;
    await task.save();

    res.status(200).json({ message: "Success!", sourceCard, destinationCard });
  } catch (error) {
    res.status(500).send(error);
  }
});

export { createCard, getAllCards, updateCardTitle, deleteById, updateTaskOrder };
