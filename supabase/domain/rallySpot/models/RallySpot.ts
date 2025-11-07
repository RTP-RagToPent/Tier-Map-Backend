import { Id as SpotId } from "../../spot/models/Id.ts";
import { Name as SpotName } from "../../spot/models/Name.ts";
import { OrderNo } from "./OrderNo.ts";

class RallySpot {
  private constructor(
    private readonly spotId: SpotId,
    private readonly spotName: SpotName,
    private readonly orderNo: OrderNo,
  ) {}

  public static of(
    { spotId, spotName, orderNo }: {
      spotId: string;
      spotName: string;
      orderNo: number;
    },
  ): RallySpot {
    return new RallySpot(
      SpotId.of(spotId),
      SpotName.of(spotName),
      OrderNo.of(orderNo),
    );
  }

  public getSpotId(): SpotId {
    return this.spotId;
  }

  public getSpotName(): SpotName {
    return this.spotName;
  }

  public getOrderNo(): OrderNo {
    return this.orderNo;
  }
}

export { RallySpot };
