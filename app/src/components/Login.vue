<template>
    <v-content class="login-form-content">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-form @submit.prevent="login()">
                        <v-card class="elevation-12">
                            <v-toolbar>
                                <v-toolbar-title>Login</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field prepend-icon="person" name="username" label="Benutzername" type="text"
                                    v-model="username" :error-messages="usernameError" required @input="clearErrors()">
                                </v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Passwort" type="password"
                                    v-model="password" :error-messages="unknownError || passwordError" required @input="clearErrors()">
                                </v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="login()" type="submit">Anmelden</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    import axios from 'axios';
    import storage from '../utils/storage';

    axios.defaults.withCredentials = true;

    export default {
        data: () => ({
            username: '',
            password: '',
            usernameError: '',
            passwordError: '',
            unknownError: ''
        }),
        mounted() {
            storage.removeValue('username');
            storage.removeValue('administrator');
        },
        methods: {
            clearErrors() {
                this.usernameError = this.passwordError = this.unknownError = '';
            },
            login() {
                this.clearErrors();
                axios.post(`http://127.0.0.1:3003/users/${this.username}/login`, {
                    password: this.password
                }).then((response) => {
                    storage.setValue('username', this.username);
                    storage.setValue('administrator', response.data.administrator);
                    this.$router.push('/');
                })
                .catch((err) => {
                    console.error(err);
                    this.unknownError = 'Anmeldung fehlgeschlagen';
                })
            }
        }
    }
</script>