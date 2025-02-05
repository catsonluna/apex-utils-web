import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  useStore,
} from "@builder.io/qwik";
import Topbar from "~/components/common/topbar";
import Footer from "~/components/common/footer";
import axios from "axios";
import { API_URL } from "~/utils/consts";
import Chart from "~/components/charts/chart";
import { ChartTypeRegistry } from "chart.js";
import Search from "~/components/common/input/search";

export default component$(() => {
  const lootData = useStore<any>({});
  const chartType = useSignal<keyof ChartTypeRegistry>("pie");
  const zones = useSignal<string[]>([]);
  const zone = useSignal<string>(zones.value[0]);

  useVisibleTask$(async () => {
    const res = await axios.get(`${API_URL}/loot/zones`);
    zones.value = res.data;
    zone.value = zones.value[0];
    const loot = await axios.get(`${API_URL}/loot/get/` + zones.value[0]);
    console.log(loot.data);
    lootData.value = loot.data;
  });

  if (!lootData.value) return <></>;
  return (
    <>
      <Topbar />
      <main class="flex flex-col items-center text-center">
        <h1 class="mb-8 text-6xl font-bold text-white">
          {lootData.value.info.zone}
        </h1>
        <Search
          values={zones.value}
          label="Zone"
          value={zone.value}
          onChange={$((value: string) => {
            zone.value = value;
            axios.get(`${API_URL}/loot/get/` + value).then((res) => {
              lootData.value = res.data;
            });
          })}
        />
        <Search
          label="Select Chart Type"
          values={["pie", "line", "bar", "doughnut"]}
          value={chartType.value}
          onChange={$((val: string) => {
            chartType.value = val as keyof ChartTypeRegistry;
            console.log(chartType.value);
          })}
        />
        <div class="grid w-[100vw] grid-cols-1 gap-2 rounded-lg bg-[rgba(0,0,0,0.4)] p-4 md:w-[90vw] md:grid-cols-2 ">
          <div class="color-white">
            <h1
              class="
          mb-4
          text-center
          text-4xl
          font-bold
          text-white
            "
            >
              Total
            </h1>
            <Chart
              key={`total-${zone.value}-${chartType.value}`}
              options={{ responsive: true }}
              type={chartType.value}
              data={{
                labels: (() => {
                  // Combine labels and their corresponding values
                  const combined = Object.keys(lootData.value.total).map(
                    (key: string) => ({
                      label: key,
                      value: lootData.value.total[key].TOTAL,
                    }),
                  );

                  // Sort in descending order (modify comparator for ascending)
                  combined.sort((a, b) => b.value - a.value);

                  // Calculate the total for percentage calculation
                  const total = combined.reduce(
                    (acc, item) => acc + item.value,
                    0,
                  );

                  // Return sorted labels with percentages
                  return combined.map((item) => {
                    return `${item.label} (${((item.value / total) * 100).toFixed(2)}%)`;
                  });
                })(),
                datasets: [
                  {
                    label: "Total",
                    data: (() => {
                      // Combine labels and their corresponding values
                      const combined = Object.keys(lootData.value.total).map(
                        (key: string) => ({
                          label: key,
                          value: lootData.value.total[key].TOTAL,
                        }),
                      );

                      // Sort in descending order (modify comparator for ascending)
                      combined.sort((a, b) => b.value - a.value);

                      // Return sorted values
                      return combined.map((item) => item.value);
                    })(),
                  },
                ],
              }}
            />
          </div>
          {Object.keys(lootData.value.total).map((key: string) => {
            const zoneData = lootData.value.total[key];
            if (!(zoneData instanceof Object)) return null;
            // go over all children of zoneData and print them
            Object.keys(zoneData).forEach((key) => {
              console.log(zoneData[key]);
              // zoneData is an object, print out the count of its keys
              if (zoneData[key] instanceof Object) {
                console.log("Children: " + Object.keys(zoneData[key]).length);
                // if more than 1 and not in main level of total
                if (
                  Object.keys(zoneData[key]).length > 1 &&
                  !Object.keys(lootData.value.total).includes(key)
                ) {
                  lootData.value = {
                    ...lootData.value,
                    total: {
                      ...lootData.value.total,
                      [key]: zoneData[key],
                    },
                  };
                }
              }
            });

            let labels = Object.keys(zoneData);
            let dataValues = Object.values(zoneData).map(
              (val: any) => val.TOTAL,
            );

            const totalIndex = labels.indexOf("TOTAL");
            if (totalIndex > -1) {
              labels.splice(totalIndex, 1);
              dataValues.splice(totalIndex, 1);
            }
            if (dataValues.length === 0) return null;

            // Combine and sort labels with their corresponding values
            const combined = labels.map((label, index) => ({
              label,
              value: dataValues[index],
            }));

            // Sort in descending order (modify comparator for ascending)
            combined.sort((a, b) => b.value - a.value);

            // Split back into sorted arrays
            labels = combined.map((item) => item.label);
            dataValues = combined.map((item) => item.value);

            const total = dataValues.reduce(
              (acc: number, val: number) => acc + val,
              0,
            );
            labels = labels.map((label: string) => {
              return `${label} (${((zoneData[label].TOTAL / total) * 100).toFixed(2)}%)`;
            });

            return (
              <div class="color-white" key={`${key}-container`}>
                <h1
                  class="
          mb-4
          text-center
          text-4xl
          font-bold
          text-white
            "
                >
                  {key}
                </h1>
                <Chart
                  key={`${key}-${zone.value}-${chartType.value}`}
                  options={{
                    responsive: true,
                    keepAspectRatio: false,
                  }}
                  type={chartType.value}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: key,
                        data: dataValues,
                      },
                    ],
                  }}
                />
              </div>
            );
          })}
        </div>
        <p class="mb-8 opacity-75">
          simulations ran {lootData.value.info.zone_it}x
          {lootData.value.info.loot_it}
        </p>
      </main>
      <Footer />
    </>
  );
});
