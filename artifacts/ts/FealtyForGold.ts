/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as FealtyForGoldContractJson } from "../nft/templates/FealtyForGold.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace FealtyForGoldTypes {
  export type Fields = {
    lordAddress: Address;
    lordnftclass: bigint;
    bribe: bigint;
    time: bigint;
    goldtokenid: HexString;
    fealtyId: HexString;
    minimumClass: bigint;
    owner: Address;
    campaign: HexString;
    subjecttarget: Address;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getLord: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getTime: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getBribe: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getCampaign: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getSubjecttarget: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  FealtyForGoldInstance,
  FealtyForGoldTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as FealtyForGoldTypes.Fields;
  }

  consts = {
    ErrorCodes: {
      TooHighInStanding: BigInt(87),
      NotEnoughStanding: BigInt(86),
      NotFealtyContract: BigInt(91),
      NotSpecifiedSubject: BigInt(92),
    },
  };

  at(address: string): FealtyForGoldInstance {
    return new FealtyForGoldInstance(address);
  }

  tests = {
    swearFealty: async (
      params: TestContractParams<
        FealtyForGoldTypes.Fields,
        { subjectNftClass: bigint; caller: Address; subjectAddress: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "swearFealty", params);
    },
    destroyOffer: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "destroyOffer", params);
    },
    getLord: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getLord", params);
    },
    getTime: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getTime", params);
    },
    getBribe: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getBribe", params);
    },
    getCampaign: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getCampaign", params);
    },
    getSubjecttarget: async (
      params: Omit<
        TestContractParams<FealtyForGoldTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getSubjecttarget", params);
    },
  };
}

// Use this object to test and deploy the contract
export const FealtyForGold = new Factory(
  Contract.fromJson(
    FealtyForGoldContractJson,
    "",
    "e9c011833a5f66c61ce324fe53f8f240aa31ec90430a180ce5e2e3c79fe44b63"
  )
);

// Use this class to interact with the blockchain
export class FealtyForGoldInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<FealtyForGoldTypes.State> {
    return fetchContractState(FealtyForGold, this);
  }

  methods = {
    getLord: async (
      params?: FealtyForGoldTypes.CallMethodParams<"getLord">
    ): Promise<FealtyForGoldTypes.CallMethodResult<"getLord">> => {
      return callMethod(
        FealtyForGold,
        this,
        "getLord",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTime: async (
      params?: FealtyForGoldTypes.CallMethodParams<"getTime">
    ): Promise<FealtyForGoldTypes.CallMethodResult<"getTime">> => {
      return callMethod(
        FealtyForGold,
        this,
        "getTime",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBribe: async (
      params?: FealtyForGoldTypes.CallMethodParams<"getBribe">
    ): Promise<FealtyForGoldTypes.CallMethodResult<"getBribe">> => {
      return callMethod(
        FealtyForGold,
        this,
        "getBribe",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getCampaign: async (
      params?: FealtyForGoldTypes.CallMethodParams<"getCampaign">
    ): Promise<FealtyForGoldTypes.CallMethodResult<"getCampaign">> => {
      return callMethod(
        FealtyForGold,
        this,
        "getCampaign",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getSubjecttarget: async (
      params?: FealtyForGoldTypes.CallMethodParams<"getSubjecttarget">
    ): Promise<FealtyForGoldTypes.CallMethodResult<"getSubjecttarget">> => {
      return callMethod(
        FealtyForGold,
        this,
        "getSubjecttarget",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends FealtyForGoldTypes.MultiCallParams>(
    calls: Calls
  ): Promise<FealtyForGoldTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      FealtyForGold,
      this,
      calls,
      getContractByCodeHash
    )) as FealtyForGoldTypes.MultiCallResults<Calls>;
  }
}