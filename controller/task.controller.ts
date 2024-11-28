import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../helpers/paginationHelper";
import searchHelper from "../helpers/searchHelper"



export const index = async (req: Request, res: Response) => {
  //  Find
  interface find {
    deleted: boolean;
    status?: String;
    title?: RegExp;
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


  let searchObject = searchHelper(req.query);

    // Search Keyword
    if (req.query.keyword) {
      find.title = searchObject.regex;
    }
    // End Search Keyword



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



export const change = async (req: Request, res: Response) => {
  try {
    const id: String = req.params.id;
    const status: String = req.body.status;
    await Task.updateOne({
      _id: id, 
      deleted: false
    },{
      status: status
    })
    res.json({
      code: 200,
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại "
    });
  }

};



export const changeMulti = async (req: Request, res: Response)=> {

  try {
    const ids: String[] = req.body.ids;
    const key: String = req.body.key;
    const value: String = req.body.value;
    console.log(ids);
    console.log(key);
    console.log(value);
    enum status {
        STATUS= "status",
        DELETED="delete"
    }
    if(key == "status"){
      const arrStatus:String[] = [
        "initial",
        "doing",
        "finish",
        "pending",
        "notFinish",
     
      ];
      const checkStatus = arrStatus.includes(value.toString());
      if (!checkStatus) {
         res.status(400).json({
          code: 400,
          message: "Không có trạng thái đó",
        });
        return;
      }
    }else if(key == "delete"){
      const arrDelete:string[] = [
        "true"
        ,"false"
     
      ];
      const checkStatus = arrDelete.includes(value.toString());
      if (!checkStatus) {
         res.status(400).json({
          code: 400,
          message: "Không có trạng thái đó",
        });
        return;
      }
    }


    switch(key){
      case status.STATUS:{
        await Task.updateMany({
          _id: { $in : ids},
          deleted: false
        },{
          status: value
        })
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công",
        });
        break;
      }
      case status.DELETED:{
        await Task.updateMany({
          _id: { $in : ids},
          deleted: false
        },{
          deleted: true
        })
        res.json({
          code: 200,
          message: "Xóa thành công",
        });
        break;
      }
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại",
    });
  }
};
