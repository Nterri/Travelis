import * as React from "react";
import { useEffect, useState } from "react";
import { LoadData } from "../../components/LoadData/LoadData";
import { List } from "../../components/List/List";
import { Tour } from "../../components/Tour/Tour";
import { getDataTours, ReferenceType } from "../HomeScreen";
import { TourType } from "../../api/tours";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useSearchParams } from "react-router-dom";
import { getDateByTime } from "../../services/time";

export interface IToursScreenProps {}
export const ToursScreen: React.FC<IToursScreenProps> = function ({}) {
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const toursLoading = useSelector((state: RootState) => state.tours.loading);
  const tours = useSelector((state: RootState) => state.tours.data);
  const [filterTours, setFilterTours] = useState<Array<TourType>>([]);

  useEffect(() => {
    const city = searchParams.get("city");
    const start = Number(searchParams.get("start"));
    const end = Number(searchParams.get("end"));
    if (city && start && end) {
      setFilterTours(
        tours.filter(
          (tour) =>
            start >= tour.dateStart &&
            end <= tour.dateEnd &&
            tour.city === city,
        ),
      );
    } else {
      setFilterTours(tours);
    }
  }, [tours, searchParams]);

  return (
    <LoadData status={toursLoading} getData={() => getDataTours(dispatch)}>
      <List<TourType>
        title={
          "Наши туры" +
          (searchParams.get("city") &&
          Number(searchParams.get("start")) &&
          Number(searchParams.get("end"))
            ? ` - Город: ${searchParams.get("city")}, Начало: ${getDateByTime(Number(searchParams.get("start")))}, Конец: ${getDateByTime(Number(searchParams.get("end")))}`
            : "")
        }
        data={filterTours}
        element={(item) => (
          <Tour
            id={item.id}
            title={item.name}
            image={item.image}
            desc={item.description}
            dateStart={item.dateStart}
            dateEnd={item.dateEnd}
            reference={ReferenceType.TOURS_SCREEN}
          />
        )}
      />
    </LoadData>
  );
};
