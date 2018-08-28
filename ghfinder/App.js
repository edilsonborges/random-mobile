import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

import Repo from "./components/Repo";
import NewRepoModal from "./components/NewRepoModal";

type Props = {};
export default class App extends Component<Props> {
  state = {
    modalVisible: false,
    repos: []
  };

  async componentDidMount() {
    const repos =
      JSON.parse(await AsyncStorage.getItem("@Appteste:repositories")) || [];
    this.setState({ repos });
  }

  _addRespoitory = async newRepoText => {
    const repoCall = await fetch(`http://api.github.com/repos/${newRepoText}`);
    const response = await repoCall.json();

    const repository = {
      id: response.id,
      thumbnail: response.owner.avatar_url,
      title: response.name,
      author: response.owner.login
    };

    this.setState({
      modalVisible: false,
      repos: [...this.state.repos, repository]
    });

    await AsyncStorage.setItem(
      "@Appteste:repositories",
      JSON.stringify(this.state.repos)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Lista simples com RN!</Text>
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={styles.headerButton}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.repoList}>
          {this.state.repos.map(repo => (
            <Repo key={repo.id} data={repo} />
          ))}
        </ScrollView>
        <NewRepoModal
          onCancel={() => this.setState({ modalVisible: false })}
          onAdd={this._addRespoitory}
          visible={this.state.modalVisible}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333"
  },
  header: {
    height: Platform.OS === "ios" ? 70 : 50,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  repoList: {
    padding: 20
  },
  headerButton: {
    fontSize: 24,
    fontWeight: "bold"
  }
});
