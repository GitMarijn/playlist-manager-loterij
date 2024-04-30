import express, { Router } from "express";
import apiRoutes from "./routes/api";
const app = express();
import cors from "cors";
const router = Router();
app.use(cors());
router.get(apiRoutes.paths.hello, apiRoutes.hello);

app.use("/api/", router);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
export default app;
