import React, { useEffect, useState, useCallback } from "react";
import CustomList from "../../../UIKit/CustomList/CustomList";
import {
  ItemData,
  ItemDataString,
  ListColumnData,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { RequestListData } from "../../shared/types";
import { FetchData } from "../../../UIKit/CustomList/CustomListTypes.ts";
import Scripts from "../../shared/utils/clientScripts";
import CustomInput from "../../../UIKit/CustomInput/CustomInput";
import SliderPanel from "../SliderPanel/SliderPanel";
import RequestDetails from "./RequestDetails/RequestDetails.tsx";
import utils from "../../shared/utils/utils";

/** Список обращений */
export default function RequestList() {
  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState<string>("");
  //Состояние слайдера
  const [sliderActive, setSliderActive] = useState(false);

  /** Обработчик нажатия на номер обращения */
  const onClickNumberRequest = async (requestId: string) => {
    if (!requestId) return;

    utils.setRequest(requestId);

    const link = Scripts.getRequestPagePath();
    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (requestId) redirectUrl.searchParams.set("request_id", requestId);
    utils.redirectSPA(redirectUrl.toString());
  };

  //Детальная информация обращений
  const getDetailsLayout = ({
    rowData,
    onClickRowHandler,
    reloadData,
  }: {
    rowData: RequestListData;
    onClickRowHandler?: () => void;
    reloadData?: () => void;
  }) => {
    return (
      <RequestDetails
        rowData={rowData}
        onClickRowHandler={onClickRowHandler}
        reloadData={reloadData}
        onClickNumberRequest={onClickNumberRequest}
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
      onClick: onClickNumberRequest,
    }),
    new ListColumnData({
      name: "Дата создания",
      code: "createdAt",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Тип канала",
      code: "channel",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Тема обращения",
      code: "topic",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Статус",
      code: "statusRequest",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Причина обращения",
      code: "reason",
      fr: 2,
      isSortable: true,
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

  const getFilteredRequestList = async (
    page: number,
    sortData?: SortData
  ): Promise<FetchData<RequestListData>> => {
    const data = await Scripts.getRequestList(page, sortData);
    if (!sliderActive) {
      const filteredItems = data.items.filter(
        (item) => item.data.statusRequest?.info !== "zakryto"
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
          title="Закрытые обращения"
          isVisible={sliderActive}
          setIsVisible={setSliderActive}
        />
      </div>
      <div className="request-list__list">
        <CustomList<String, RequestListData>
          key={sliderActive ? "closed" : "all"}
          columnsSettings={columns}
          getDataHandler={getFilteredRequestList}
          getDetailsLayout={getDetailsLayout}
          isScrollable={false}
          searchFields={searchFields}
          searchData={searchQuery}
        />
      </div>
    </div>
  );
}
