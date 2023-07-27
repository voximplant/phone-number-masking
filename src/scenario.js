'use strict';

VoxEngine.addEventListener(
  AppEvents.CallAlerting,
  ({
    call: couriersCallLeg, // the object with the incoming couriersCallLe is stored here
    callerid, // couriers telephone number
    destination: virtualNumber, // virtual number that was dialed by courier and from which we will make couriersCallLeg to the client
  }) => {
    couriersCallLeg.startEarlyMedia();

    const googlePlayer = VoxEngine.createTTSPlayer('Searching for clients number', {
      'language': VoiceList.Google.en_US_Standard_B,
    });
    googlePlayer.sendMediaTo(couriersCallLeg);
    googlePlayer.addEventListener(PlayerEvents.PlaybackFinished, async () => {
      let clientsPhone = await getInformationFromKVS(callerid);
      if (!clientsPhone) {
        let clientData = await getInformationFromDB();
        try {
          clientData = JSON.parse(clientData);
          clientsPhone = clientData[0].clientsPhone;
          ApplicationStorage.put(clientsPhone, callerid);
          ApplicationStorage.put(callerid, clientsPhone);
        } catch (error) {
          clientsPhone = null;
        }
      }
      if (!clientsPhone) {
        raiseSomeAlerts();
        couriersCallLeg.hangup();
        VoxEngine.terminate();
        return;
      }
      // Call the client
      initiateCallToClient(couriersCallLeg, clientsPhone, virtualNumber);
    });
  },
);

const initiateCallToClient = (couriersCallLeg, clientsPhone, virtualNumber) => {
  const googlePlayer = VoxEngine.createTTSPlayer('Connecting with client', {
    'language': VoiceList.Google.en_US_Standard_B,
  });
  googlePlayer.sendMediaTo(couriersCallLeg);
  googlePlayer.addEventListener(PlayerEvents.PlaybackFinished, () => {
    const clientsCallLeg = VoxEngine.callPSTN(clientsPhone, virtualNumber);
    clientsCallLeg.addEventListener(CallEvents.Connected, () => {
      VoxEngine.sendMediaBetween(couriersCallLeg, clientsCallLeg);
      clientsCallLeg.record();
    });
    clientsCallLeg.addEventListener(CallEvents.Disconnected, () => {
      couriersCallLeg.hangup();
      VoxEngine.terminate();
    });
  });
};

const getInformationFromKVS = async (couriersNumber) => {
  try {
    const response = await ApplicationStorage.get(couriersNumber);
    return response.value;
  } catch (error) {
    Logger.write("Failed to get the client's telephone number from KVS with exception");
    Logger.write(error);
  }
};

const getInformationFromDB = async () => {
  try {
    const options = new Net.HttpRequestOptions();
    options.header = ['Content-Type: application/json'];
    options.method = 'Get';
    const response = await Net.httpRequestAsync('URL', options);
    return response;
  } catch (error) {
    Logger.write("Failed to get the client's telephone number from DB with exception");
    Logger.write(error);
  }
};

const raiseSomeAlerts = () => {
  Logger.write('Your alert message');
};