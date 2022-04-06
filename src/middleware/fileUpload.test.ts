import { uploadImage } from "./fileUpload";

beforeAll(() => {
  uploadImage.single = jest.fn();
});

describe("uploadImage", () => {
  it("should be called", () => {
    uploadImage.single("file");
    expect(uploadImage.single).toBeCalled();
  });
});