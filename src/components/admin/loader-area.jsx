// single loader

import Loader from "@/components/loader/loader";

function AreaLoader({ loading }) {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "700px" }}
    >
      <Loader loading={loading} />
    </div>
  );
}
export default AreaLoader;
