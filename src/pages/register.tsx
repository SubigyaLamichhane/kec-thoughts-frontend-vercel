import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: {
              options: {
                email: values.email,
                username: values.username,
                password: values.password,
              },
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            //worked
            router.push('/');
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="example@example.com"
              label="Email"
              type="email"
              textarea={false}
            />
            <Box mt={8}>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
                textarea={false}
              />
            </Box>
            <Box mt={8}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
                textarea={false}
              />
            </Box>
            <Box mt={8}>
              <Button type="submit" color="teal" isLoading={isSubmitting}>
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
