import AWS from "aws-sdk";
import { config } from "dotenv";

config();

const getVideos = async () => {
  const s3 = new AWS.S3();

  const items = await s3
    .listObjectsV2({
      Bucket: "bucket-demo-transcoder",
    })
    .promise();
    console.log(items);

  if (items.Contents) {
    return items.Contents.map((content) => content.Key) as string[];
  }

  throw new Error("No contents");
};

const transcodeVideos = async (videosArr: string[]) => {
  const transcoder = new AWS.ElasticTranscoder();

  for (const video of videosArr) {
    const job = await transcoder
      .createJob({
        PipelineId: "1631890102449-gbeppk",
        Input: {
          Key: video,
          Container: "mp4",
        },
        Output: {
          Key: `transcoder/${video}`,
          PresetId: "1351620000001-000010",
        },
      })
      .promise();
  }
};

const main = async () => {
  const videos = await getVideos();
  transcodeVideos(videos);
};

main();
