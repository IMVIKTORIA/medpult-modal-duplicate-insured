import React, { useEffect, useState } from "react";
import Button from "../../../UIKit/Button/Button";
import TabsWrapper from "../../../UIKit/Tabs/TabsWrapper/TabsWrapper.tsx";
import TabItem from "../../../UIKit/Tabs/TabItem/TabItem.tsx";
import ModalWrapper from "./ModalWrapper/ModalWrapper";
import InsuredList from "../InsuredList/InsuredList";
import RequestList from "../RequestList/RequestList.tsx";
import TaskList from "../TaskList/TaskList.tsx";
import icons from "../../shared/icons.tsx";
import Scripts from "../../shared/utils/clientScripts";

/**Модальное окно */
export default function ModalDuplicate() {
  // количество выбранных застрахованных
  const [selectedInsuredCount, setSelectedInsuredCount] = useState<number>(0);
  //общее количество застрахованных
  const [insuredCount, setInsuredCount] = useState<number>(0);
  const fetchInsuredCount = async () => {
    const count = await Scripts.getCountInsured();
    setInsuredCount(count);
  };
  //общее количество обращений
  const [requestCount, setRequestCount] = useState<number>(0);
  const fetchRequestCount = async () => {
    const count = await Scripts.getCountRequest();
    setRequestCount(count);
  };
  //общее количество задач
  const [taskCount, setTaskCount] = useState<number>(0);
  const fetchTaskCount = async () => {
    const count = await Scripts.getCountTask();
    setTaskCount(count);
  };

  useEffect(() => {
    fetchInsuredCount();
    fetchRequestCount();
    fetchTaskCount();
  }, []);

  //Закрыть модальное окно
  const modalClose = () => {};

  return (
    <ModalWrapper>
      <div className="duplicate-modal">
        <div className="duplicate-modal__header">
          <span className="duplicate-modal__header__label">
            Возможные дубли застрахованного
          </span>
          <span
            className="duplicate-modal__header__closed"
            onClick={modalClose}
          >
            {icons.Cross}
          </span>
        </div>
        <div className="duplicate-modal__content">
          <TabsWrapper>
            <TabItem
              code={"insuredContragen"}
              name={`Застрахованные (${selectedInsuredCount} из ${insuredCount})`}
            >
              <InsuredList setSelectedInsuredCount={setSelectedInsuredCount} />
            </TabItem>
            <TabItem
              code={"requests"}
              name={`Обращения (${requestCount} из ${requestCount})`}
            >
              <RequestList />
            </TabItem>
            <TabItem
              code={"tasks"}
              name={`Задачи (${taskCount} из ${taskCount})`}
            >
              <TaskList />
            </TabItem>
          </TabsWrapper>
        </div>
      </div>
    </ModalWrapper>
  );
}
