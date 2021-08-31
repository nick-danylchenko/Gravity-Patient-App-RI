import React, {useEffect} from "react";
import {HStack, ScrollView, View, Text, Pressable, Button, Box} from "native-base";
import SyncInfo from "../components/home/SyncInfo";
import UserCard from "../components/home/UserCard";
import ClinicalStaffCard from "../components/home/ClinicalStaffCard";
import CaregiversCard from "../components/home/CaregiversCard";
import OrganizationsCard from "../components/home/OrganizationsCard";
import InsurancesCard from "../components/home/InsurancesCard";
import ReferralsCard from "../components/home/ReferralsCard";
import AssessmentsCard from "../components/home/AssessmentsCard";
import { useRecoilState } from "recoil";
import { serversState } from "../recoil/servers";
import patientState from "../recoil/patient";
import url from "../recoil/delete";
import Client from "fhir-kit-client";
import {Linking} from "react-native";
import role from "../recoil/roleState";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import PatientInfo from "./PatientInfo";

const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">): JSX.Element => {
	const [servers] = useRecoilState(serversState);
	const [patients, setPatient] = useRecoilState(patientState);
	const [roleState, setRoleState] = useRecoilState(role);
	const [urlState, setUrlState] = useRecoilState(url);
	let href =  urlState.toString();

	useEffect(() => {
		Object.keys(servers).forEach(key => {
			const server = servers[key];
			href = urlState.toString();

			server && server.session && getPatient(server.fhirUri, server.session.token.access, server.session.patientId);
		});
	},[servers])

	const getPatient = async (serverURI, token, id) => {
		const client = new Client({ baseUrl: serverURI });
		client.bearerToken = token;

		try {
			const patient = await client.read({ resourceType: "Patient", id });
			console.log("got patient", patient);
			setPatient([...patients, patient]);
		} catch (e) {
			console.log(e);
		}
	};

	const fo = () => {
		Linking.openURL(href);
	}
	if (!Object.keys(servers).length) {
		return (
			<View flex={1} alignItems="center" justifyContent="center">
				<Text>No Data Yet</Text>
				<Button onPress={fo}>dwdwqdwqd</Button>
			</View>
		);
	}

	return (
		<ScrollView
			pt={2}
			pb={2}
		>
			<HStack>
				<SyncInfo/>
			</HStack>

			<View p={5}>
				<HStack pb={5}>
					<Pressable
						flex={1}
						flexDirection="column"
						onPress={() => navigation.navigate('PatientInfo')}
					>
						<UserCard/>
					</Pressable>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate('ClinicalStaff')}
					>
						<ClinicalStaffCard />
					</Pressable>

					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate('Caregivers')}
					>
						<CaregiversCard />
					</Pressable>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate('Organizations')}
					>
						<OrganizationsCard />
					</Pressable>

					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate('Insurances')}
					>
						<InsurancesCard />
					</Pressable>
				</HStack>

				<HStack pb={5}>
					<ReferralsCard/>
				</HStack>

				<HStack>
					<AssessmentsCard/>
				</HStack>
			</View>
		</ScrollView>
	);
}

export default Home;
