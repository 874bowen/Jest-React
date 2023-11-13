import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { Calculator, add } from "./calc";
import { User } from "./types/types";
import jsonpath from "jsonpath";

expect.extend({
	toMatchJsonPath(received, argument) {
		const pass = jsonpath.query(received, argument).length > 0;
		if (pass) {
			return {
				message: () =>
					`expected ${received} not to match JSON path ${argument}`,
				pass: true,
			};
		} else {
			return {
				message: () => `expected ${received} to match JSON path ${argument}`,
				pass: false,
			};
		}
	},
});

// describe - groups a set of related tests
describe("calculator", function () {
	// it - specifies a single test
	it("should be able to add two numbers", function () {
		expect(add(1, 2)).toEqual(3);
	});

	describe("addition", () => {
		let calc: Calculator;
		// beforeEach - runs before each test in the describe block - reduces code duplication
		beforeEach(() => {
			const options = {
				precision: 2,
			};
			calc = new Calculator(options);
		});

		// afterEach - runs after each test in the describe block e.g. to clean up or disconnect from a database
		// afterEach(() => {
		//    //db.disconnect();
		// });

		// beforeAll - runs before all tests in the describe block
		// afterAll - runs after all tests in the describe block

		// beforeAll(() => {
		//    db.connect("localhost", "9999", "user", "pass");
		// });
		// afterAll(() => {
		//    db.disconnect();
		// });

		it("adds two positive numbers", () => {
			const result = calc.add(1.333, 3.2);
			expect(result).toEqual(4.53);
		});
		it("adds two negative numbers", () => {
			const result = calc.add(-1.333, -3.2);
			expect(result).toEqual(-4.53);
		});
	});

	// matchers - used to test various data types in different scenarios

	describe("matchers", () => {
		// toEqual - compares the values of two variables
		it("toEqual", () => {
			expect(1 + 1).toEqual(2);
			expect("Juntao").toEqual("Juntao");
			expect({ name: "Juntao" }).toEqual({ name: "Juntao" });
		});

		// toBe - compares the values of two variables
		it("toBe", () => {
			expect(1 + 1).toBe(2); // PASS
			expect("Juntao").toBe("Juntao"); // PASS
			// expect({ name: "Juntao" }).toBe({ name: "Juntao" }); //FAIL
			// Object.is equality
			Object.is({ name: "Juntao" }, { name: "Juntao" }); // PASS
		});

		// not
		it("not basic usage", () => {
			expect(1 + 2).not.toEqual(2);
		});

		// match - regex
		it("match regular expression", () => {
			expect("juntao").toMatch(/\w+/);
		});

		it("match numbers", () => {
			expect("185-3345-3343").toMatch(/^\d{3}-\d{4}-\d{4}$/);
			expect("1853-3345-3343").not.toMatch(/^\d{3}-\d{4}-\d{4}$/);
		});

		it("compare numbers", () => {
			expect(1 + 2).toBeGreaterThan(2);
			expect(1 + 2).toBeGreaterThanOrEqual(2);
			expect(1 + 2).toBeLessThan(4);
			expect(1 + 2).toBeLessThanOrEqual(4);
		});

		// matches for arrays and objects

		describe("array and object matchers", () => {
			const users = ["Juntao", "Abruzzi", "Alex"];

			it("match arrays", () => {
				expect(users).toContainEqual("Juntao"); // doesn't check for address equality
				expect(users).toContain(users[0]); // checks using ===
			});

			it("object in array", () => {
				const users = [{ name: "Juntao" }, { name: "Alex" }];
				expect(users).toContainEqual({ name: "Juntao" }); // PASS
				// expect(users).toContain({ name: "Juntao" }); // FAIL - checks using ===
			});

			it("match object", () => {
				const user = {
					name: "Juntao",
					address: "Xian, Shaanxi, China",
				};
				expect(user.name).toBeDefined();
				expect(user["age"]).not.toBeDefined();
			});
		});

		// powerful expect function
		describe("powerful expect", () => {
			// stringContaining
			it("string contains", () => {
				const givenName = expect.stringContaining("Juntao");
				expect("Juntao Qiu").toEqual(givenName);
			});

			// arrayContaining
			describe("array", () => {
				const users = ["Juntao", "Abruzzi", "Alex"];
				it("array containing", () => {
					const userSet = expect.arrayContaining(["Juntao", "Abruzzi"]);
					expect(users).toEqual(userSet);
				});
			});
		});

		// complex matchers
		describe("complex matchers", () => {
			const user: User = {
				name: "Ivan",
				address: "Kabarak, Nakuru, Kenya",
				projects: [
					{
						name: "Project 1",
					},
					{
						name: "Project 2",
					},
				],
			};

			it("check user name and address", () => {
				const matcher = expect.objectContaining({
					name: expect.stringContaining("Ivan"),
					address: expect.stringContaining("Kabarak"),
					projects: expect.arrayContaining([
						{
							name: expect.stringContaining("Project 1"),
						},
					]),
				});

				expect(user).toEqual(matcher);
			});

			// extend expect fn with jsonpath
			it("check user name and address using jsonpath", () => {
				const projects_res = jsonpath.query(user, "$.projects");
				console.log(JSON.stringify(projects_res));
				const project_name = jsonpath.query(user, "$.projects[0].name");
				console.log(JSON.stringify(project_name));
			});

			it("matches jsonpath", () => {
				// expect(user).toMatchJsonPath("$.name");
				// expect(user).not.toMatchJsonPath("$.age");
			});

			/**
          * This technique can be very handy in making 
            your matcher more readable, especially when you want to use a Domain Specific Language
            e.g., expect(employee).toBelongToDepartment("Product Halo");
          */
		});

		/**
		 * mocking - where we simply simulate the function call rather than actually invoking it
		 */

		describe("mocking", () => {
			const fetchUser = (id: string, process: () => void) => {
				return fetch(`http://localhost:4000/users/${id}`);
			};
			/**
			 * 1. jest.fn() for Spying
			 *    - A mock can track all the invocations to it. And it can record the invoke times, and the parameter passed in for each invoke
			 */
			it("create a callable function", () => {
				const mock = jest.fn();
				mock("Juntao");
				expect(mock).toHaveBeenCalled();
				expect(mock).toHaveBeenCalledWith("Juntao");
				expect(mock).toHaveBeenCalledTimes(1);
			});

			/**
			 * 2. Mock Implementation
			 * 	- you can define an implementation by yourself too
			 */
			it("mock implementation", () => {
				const fakeAdd = jest.fn().mockImplementation((a, b) => 5);
				expect(fakeAdd(1, 1)).toBe(5);
				expect(fakeAdd).toHaveBeenCalledWith(1, 1);
			});

			/**
			 * 3. Stub a remote service call
			 * 	- you can stub a remote service call
			 */

			describe("mock API call", () => {
				const user = {
					name: "Juntao",
				};
				it("mock fetch", () => {
					// given
					global.fetch = jest
						.fn()
						.mockImplementation(() => Promise.resolve({ user }));
					const process = jest.fn();
					// when
					fetchUser(111).then((x) => console.log(x));
					// then
					expect(global.fetch).toHaveBeenCalledWith(
						"http://localhost:4000/users/111"
					);
				});
			});
		});
	});
});
