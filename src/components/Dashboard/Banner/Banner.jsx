import "styles/Banner/Banner.css";
import { Carousel } from "antd";
import { useFetchBanners } from "hooks/banner/useFetchBanner";
import { useMinusBudget } from "hooks/banner/useMinusBudget";

const contentStyle = {
  height: "100px",
  width: "200px",
  color: "#fff",
  background: "#364d79",
};

const Banner = () => {
  const { data, isError, isLoading, refetch } = useFetchBanners();
  const { mutate } = useMinusBudget();
  console.log(data);

  const carouselSettings = {
    autoplay: true,
    dots: false,
    beforeChange: (oldIndex, newIndex) => {
      if (newIndex >= 0 && newIndex < data?.data.length) {
        const campaginId = data.data[newIndex].campaginId;
        mutate({ id: campaginId });
      }
    },
    afterChange: (currentSlide) => {
      if (currentSlide === data?.data.length - 1) {
        refetch();
      }
    },
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  return (
    <div className="dashboard_banner">
      <Carousel {...carouselSettings}>
        {data?.data.map((item) => (
          <div key={item.campaginId} className="banner" style={{ ...contentStyle }}>
            <img src={`${item.urlImg}`} alt="banner" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
