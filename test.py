from tm_simulator import TuringMachine

# Transition table
transition_table = {
    ("q0", "("): ("q1", "X", "R"),
    ("q0", ")"): ("q_reject", ")", "R"),
    ("q0", "0"): ("q0", "0", "R"),
    ("q0", "1"): ("q0", "1", "R"),
    ("q0", "_"): ("q_accept", "_", "R"),

    ("q1", "("): ("q1", "X", "R"),
    ("q1", ")"): ("q2", "Y", "L"),
    ("q1", "0"): ("q1", "0", "R"),
    ("q1", "1"): ("q1", "1", "R"),
    ("q1", "_"): ("q_reject", "_", "R"),

    ("q2", "("): ("q3", "(", "L"),
    ("q2", ")"): ("q2", ")", "L"),
    ("q2", "0"): ("q2", "0", "L"),
    ("q2", "1"): ("q2", "1", "L"),
    ("q2", "X"): ("q4", "X", "R"),

    ("q3", "("): ("q1", "X", "R"),
    ("q3", ")"): ("q_reject", ")", "R"),
    ("q3", "0"): ("q3", "0", "L"),
    ("q3", "1"): ("q3", "1", "L"),
    ("q3", "X"): ("q0", "X", "R"),

    ("q4", "("): ("q1", "X", "R"),
    ("q4", ")"): ("q2", "Y", "L"),
    ("q4", "0"): ("q4", "0", "R"),
    ("q4", "1"): ("q4", "1", "R"),
    ("q4", "Y"): ("q5", "Y", "R"),

    ("q5", "("): ("q_reject", "(", "R"),
    ("q5", ")"): ("q5", ")", "R"),
    ("q5", "0"): ("q5", "0", "R"),
    ("q5", "1"): ("q5", "1", "R"),
    ("q5", "_"): ("q_accept", "_", "R"),
}

# Test cases
test_cases = [
    ("01(11(0))(1)", True),
    ("01(11(0)(1)", False),
    ("(01)11(0(1))0", True),
    ("(01)11(0(1)0", False),
]

for test_case in test_cases:
    input_string, expected_result = test_case
    tm = TuringMachine(transition_table, initial_state="q0", final_states=["q_accept", "q_reject"], tape=list(input_string + "_"))
    result = tm.run()

   
