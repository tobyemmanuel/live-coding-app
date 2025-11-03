import { Router } from "express";
import submissionController from "../controllers/submission-controller";

const submission= Router();
submission.post('submit', submissionController.submitExam);
