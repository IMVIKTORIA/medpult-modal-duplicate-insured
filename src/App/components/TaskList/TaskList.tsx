import React, { useEffect, useState } from "react";
import CustomList from "../../../UIKit/CustomList/CustomList";
import {
  ItemData,
  ItemDataString,
  ListColumnData,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { FetchData } from "../../../UIKit/CustomList/CustomListTypes.ts";
import { TaskListData } from "../../shared/types";
import Scripts from "../../shared/utils/clientScripts";
import CustomInput from "../../../UIKit/CustomInput/CustomInput";
import SliderPanel from "../SliderPanel/SliderPanel";
import utils from "../../shared/utils/utils";
import TaskDetails from "./TaskDetails/TaskDetails";

/** Список задач */
export default function TaskList() {
  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState<string>("");
  //Состояние слайдера
  const [sliderActive, setSliderActive] = useState(false);

  /** Обработчик нажатия на номер задачи */
  const onClickNumberTask = async (taskId: string) => {
    if (!taskId) return;

    const requestId = await Scripts.getRequestIdByTaskId(taskId);
    utils.setRequest(requestId);
    localStorage.setItem("taskId", taskId);

    // Переход
    const link = await Scripts.getRequestPagePath();

    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (requestId) redirectUrl.searchParams.set("request_id", requestId);
    if (taskId) redirectUrl.searchParams.set("task_id", taskId);
    utils.redirectSPA(redirectUrl.toString());
  };

  //Детальная информация задач
  const getDetailsLayout = ({
    rowData,
    onClickRowHandler,
    reloadData,
  }: {
    rowData: TaskListData;
    onClickRowHandler?: () => void;
    reloadData?: () => void;
  }) => {
    return (
      <TaskDetails
        rowData={rowData}
        onClickRowHandler={onClickRowHandler}
        reloadData={reloadData}
        onClickNumberTask={onClickNumberTask}
      />
    );
  };
  /** Колонки списка */
  const columns = [
    new ListColumnData({
      name: "Номер",
      code: "number",
      fr: 1,
      isSortable: true,
      isLink: true,
      onClick: onClickNumberTask,
    }),
    new ListColumnData({
      name: "Дата создания",
      code: "createdAt",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Тип задачи",
      code: "type",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Вид задачи",
      code: "sort",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Статус",
      code: "statusTask",
      fr: 1,
      isSortable: true,
      isIcon: true,
    }),
    new ListColumnData({
      name: "Форма согласования",
      code: "formApproval",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Статус согласования",
      code: "statusApproval",
      fr: 1,
      isSortable: true,
      isIcon: true,
    }),
    // Кнопка разворачивания
    new ListColumnData({
      code: "isOpen",
      name: "",
      fr: 1,
      fixedWidth: "36px",
      isIcon: true,
    }),
  ];

  const getFilteredTaskList = async (
    page: number,
    sortData?: SortData
  ): Promise<FetchData<TaskListData>> => {
    const data = await Scripts.getTaskList(page, sortData);
    if (!sliderActive) {
      const filteredItems = data.items.filter(
        (item) => item.data.statusTask?.info !== "complete"
      );
      return {
        ...data,
        items: filteredItems,
      };
    }
    // Если слайдер активен — возвращаем всё как есть
    return data;
  };

  const searchFields = columns
    .filter((col) => col.code !== "isOpen")
    .map((col) => col.code);

  return (
    <div className="request-list">
      <div className="request-list__search">
        {/* Поле поиска */}
        <CustomInput
          value={searchQuery}
          setValue={setSearchQuery}
          cursor="text"
          placeholder="Поиск"
        />
        <SliderPanel
          title="Закрытые задачи"
          isVisible={sliderActive}
          setIsVisible={setSliderActive}
        />
      </div>
      <div className="request-list__list">
        <CustomList<String, TaskListData>
          key={sliderActive ? "closed" : "all"}
          columnsSettings={columns}
          getDataHandler={getFilteredTaskList}
          getDetailsLayout={getDetailsLayout}
          isScrollable={false}
          searchFields={searchFields}
          searchData={searchQuery}
        />
      </div>
    </div>
  );
}
