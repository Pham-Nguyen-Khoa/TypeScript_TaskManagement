 interface paginationObject{
    currentPage: number,
    limitItems: number,
    skip?: number,
    totalPage?: number
 }
 
 
const paginationHelper = (paginationObject: paginationObject, query: Record<string,any>, countTask: number): paginationObject => {
    if(query.page){
        paginationObject.currentPage = parseInt(query.page);
    }
    if(query.limit){
        paginationObject.limitItems = parseInt(query.limit);
    }
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limitItems;
    paginationObject.totalPage = Math.ceil(countTask/paginationObject.limitItems);
    return paginationObject
}

export default paginationHelper