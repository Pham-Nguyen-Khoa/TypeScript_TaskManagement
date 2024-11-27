import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../helpers/paginationHelper";
export const index = async (req: Request, res: Response) => {
  //  Find
  interface find {
    deleted: boolean;
    status?: String;
  }

  const find: find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status.toString();
  }

  // End Find

  // Sort 
  const sort = {}
  if(req.query.sortKey && req.query.sortValue){
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;

  }

  // End Sort 

  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2,

  };
  const countTasks = await Task.countDocuments(find);
  const paginationObject = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  //End Pagination



  const tasks = await Task.find(find).sort(sort).limit(paginationObject.limitItems).skip(paginationObject.skip);
  res.json({
    tasks: tasks,
    totalPages: paginationObject.totalPage
  });
};

export const detail = async (req: Request, res: Response) => {
  const id: String = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });
  res.json(task);
};
