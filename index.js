const express = require("express");
const http = require("http");
const Socket = require("socket.io");
const cors = require("cors");
require("dotenv").config;

const dbConnection = require("./db/db");

const authRouter = require("./controllers/authController");
const profileRouter = require("./controllers/profileController");
const DotAndBoxesRouter = require("./controllers/DotAndBoxesController");
const TicTackToeRouter = require("./controllers/TicTacToeController");
const SudokuRouter = require("./controllers/SudokuController");
const BingoRouter = require("./controllers/BingoController");
const LeaderBoardRouter = require("./controllers/LeaderBoardController");
const MinesweeperRouter = require("./controllers/MinesweeperController");
const RoomRouter=require("./controllers/RoomController");

const app = express();
const httpServer = http.createServer(app);
const SocketServer = Socket.Server;

dbConnection();

const backendPort = 5000;
const frontend = "https://game-classix.netlify.app";

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/dotAndBoxes", DotAndBoxesRouter);
app.use("/ticTacToe", TicTackToeRouter);
app.use("/sudoku", SudokuRouter);
app.use("/bingo", BingoRouter);
app.use("/leaderboard", LeaderBoardRouter);
app.use("/minesweeper", MinesweeperRouter);
app.use("/room",RoomRouter);

const io = new SocketServer(httpServer, {
  cors: {
    origin: frontend,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

httpServer.listen(backendPort, () => {
  console.log(`backend is running on port ${backendPort}`);
});

app.get("/", (req, res) => {
  res.send("mox is gr8!!!");
});

const {
  roomPlayers,
  isGameStartedForRoom,
  maxPlayersInGame,
} = require("./shared");

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(`player with socket id ${socket.id} connected`);
    data = JSON.parse(data);
    console.log(data);

    const game = data["game"];
    const room = data["room"];
    const username = data["username"];

    if (!roomPlayers[game][room]) {
      roomPlayers[game][room] = new Set();
      isGameStartedForRoom[room] = false;
    }

    if (isGameStartedForRoom[game][room] === true) {
      socket.emit(
        "room_join_error",
        "The game has already started in this room."
      );
      return;
    }

    if (roomPlayers[game][room].size === maxPlayersInGame[game]) {
      socket.emit("room_join_error", "The room has already max players");
      return;
    }

    if (game === "bingo") {
      roomPlayers[game][room].add([username, data["board"]]);
    } else if (game === "dotAndBoxes" || game === "ticTacToe") {
      roomPlayers[game][room].add(username);
    }

    socket.join(room);

    io.to(room).emit(
      "roomPlayers_updated",
      JSON.stringify(Array.from(roomPlayers[game][room]))
    );

    socket.on("bingo_sendNumberClicked", (num) => {
      console.log("number Click Hua");
      if (isGameStartedForRoom[game][room] === false) {
        isGameStartedForRoom[game][room] = true;
      }
      socket.to(room).emit("bingo_receiveNumberClicked", num);
    });

    socket.on("dotAndBoxes_sendLineClicked",(idOfClickedLine)=>{
      socket.to(room).emit("dotAndBoxes_receiveLineClicked",idOfClickedLine);
    })

    socket.on("ticTacToe_sendBoxClicked",(idOfClickedBox)=>{
      socket.to(room).emit("ticTacToe_receiveBoxClicked",idOfClickedBox);
    })

    socket.on("game_finished", () => {
      socket.to(room).emit("inform_gameHasFinished");
    });

    socket.on("disconnect", () => {
      // Remove player from roomPlayers
      if (roomPlayers[game][room]) {
        console.log(`player with socket id ${socket.id} disconnected`);
        socket.to(room).emit("player_left");
        delete roomPlayers[game][room];
      }
    });
  });
});
